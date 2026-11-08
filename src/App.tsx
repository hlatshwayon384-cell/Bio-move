/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { TopNav } from './components/TopNav';
import { HeroRationale } from './components/HeroRationale';
import { SuitControls } from './components/SuitControls';
import { HardwareDiagnostics } from './components/HardwareDiagnostics';
import { TelemetryWaveform } from './components/TelemetryWaveform';
import { KinematicRig } from './components/KinematicRig';
import { EventConsole } from './components/EventConsole';
import { MetabolicMonitor } from './components/MetabolicMonitor';
import { ProjectSpecs } from './components/ProjectSpecs';
import { telemetryAudio } from './utils/audio';
import { SuitConfig, TelemetryPoint, TelemetryLog } from './types/telemetry';

export default function App() {
  // Simulation Running State
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('telemetry');
  const [isEmergencyDisengaged, setIsEmergencyDisengaged] = useState<boolean>(false);

  // Suit Configuration State
  const [config, setConfig] = useState<SuitConfig>({
    mode: 'flat',
    assistTorqueNm: 45,
    suitMassKg: 32,
    gravity: 'lunar',
    gaitStyle: 'reciprocal',
    assistTimingOffset: 15,
    peakTorqueLimitNm: 85,
    dampingFactor: 1.2,
  });

  // Real-time kinematic state variables
  const [missionTimeSec, setMissionTimeSec] = useState<number>(142);
  const [kneeAngleLeft, setKneeAngleLeft] = useState<number>(34);
  const [kneeAngleRight, setKneeAngleRight] = useState<number>(32);
  const [ankleAngleLeft, setAnkleAngleLeft] = useState<number>(14);
  const [ankleAngleRight, setAnkleAngleRight] = useState<number>(12);
  const [currentStrainN, setCurrentStrainN] = useState<number>(420);
  const [peakLoadVal, setPeakLoadVal] = useState<number>(420);
  const [kneeTempC, setKneeTempC] = useState<number>(38.2);
  const [ankleTempC, setAnkleTempC] = useState<number>(39.8);
  const [batteryPct, setBatteryPct] = useState<number>(88);
  const [gaitPhasePct, setGaitPhasePct] = useState<number>(24);

  // History buffers
  const [telemetryHistory, setTelemetryHistory] = useState<TelemetryPoint[]>(() => {
    const initial: TelemetryPoint[] = [];
    for (let i = 20; i >= 0; i--) {
      initial.push({
        timeSec: Math.max(0, 142 - i),
        kneeAngleDeg: 30 + Math.round(Math.sin(i * 0.5) * 20),
        ankleAngleDeg: 12 + Math.round(Math.cos(i * 0.5) * 8),
        strainLoadN: 320 + Math.round(Math.sin(i * 0.4) * 80),
        assistTorqueNm: 45,
        emgActivityPct: 35 + Math.round(Math.sin(i * 0.5) * 25),
        gaitPhasePct: (i * 15) % 100,
      });
    }
    return initial;
  });

  const [logs, setLogs] = useState<TelemetryLog[]>([
    {
      id: '1',
      timestamp: '00:00:01',
      type: 'info',
      message: 'System initialized. Telemetry link established.',
    },
    {
      id: '2',
      timestamp: '00:00:03',
      type: 'nominal',
      message: 'BIO-MOVE Active Assist set to Lunar Regolith Mode.',
    },
  ]);

  // Keep references for interval to avoid restarting timer
  const configRef = useRef(config);
  configRef.current = config;

  const isDisengagedRef = useRef(isEmergencyDisengaged);
  isDisengagedRef.current = isEmergencyDisengaged;

  const audioRef = useRef(audioEnabled);
  audioRef.current = audioEnabled;

  const addLog = (message: string, type: TelemetryLog['type'] = 'info') => {
    const timestamp = new Date().toTimeString().split(' ')[0];
    setLogs((prev) => [
      ...prev.slice(-49),
      {
        id: Math.random().toString(36).substring(2, 9),
        timestamp,
        type,
        message,
      },
    ]);
  };

  const handleToggleAudio = () => {
    const next = !audioEnabled;
    setAudioEnabled(next);
    telemetryAudio.enabled = next;
    if (next) {
      telemetryAudio.playModeSwitch();
      addLog('Auditory telemetry feedback enabled.', 'info');
    }
  };

  const handleChangeConfig = (newVals: Partial<SuitConfig>) => {
    setConfig((prev) => {
      const updated = { ...prev, ...newVals };
      if (newVals.mode && newVals.mode !== prev.mode) {
        telemetryAudio.playModeSwitch();
        addLog(
          `EVA Mode switched to [${newVals.mode.toUpperCase()}]. Assist torque recalculated to ${updated.assistTorqueNm} Nm.`,
          'nominal'
        );
      }
      if (newVals.suitMassKg && newVals.suitMassKg !== prev.suitMassKg) {
        addLog(`Suit load updated: ${newVals.suitMassKg} kg`, 'info');
      }
      return updated;
    });
  };

  const handleEmergencyDisengage = () => {
    if (!isEmergencyDisengaged) {
      setIsEmergencyDisengaged(true);
      telemetryAudio.playWarningAlert();
      addLog('EMERGENCY DISENGAGE: Actuators decoupled.', 'alert');
    } else {
      setIsEmergencyDisengaged(false);
      telemetryAudio.playModeSwitch();
      addLog('ACTUATORS RE-ENGAGED: Active assistance nominal.', 'nominal');
    }
  };

  const handleInjectAnomaly = () => {
    telemetryAudio.playWarningAlert();
    addLog('Regolith slip anomaly detected! Reactive damping triggered.', 'warning');
    setCurrentStrainN(660);
    setPeakLoadVal(690);
    setTimeout(() => {
      addLog('Joint stabilized. Gait cycle nominal.', 'nominal');
    }, 1500);
  };

  // Primary Live Simulation Loop (1 second cadence)
  useEffect(() => {
    if (!isSimulating) return;

    let tick = 0;
    const interval = setInterval(() => {
      tick++;
      setMissionTimeSec((s) => s + 1);

      const currentConfig = configRef.current;
      const isDisengaged = isDisengagedRef.current;
      const audio = audioRef.current;

      setGaitPhasePct((prev) => {
        const next = (prev + 12) % 100;
        if (next < 15 && audio) {
          telemetryAudio.playCadenceClick();
        }
        return next;
      });

      // Kinematic angles
      const baseAngle = 35 + Math.sin(tick * 0.5) * 25;
      const noise = (Math.random() - 0.5) * 4;
      const kneeAngle = Math.max(5, Math.min(85, Math.round(baseAngle + noise)));
      const kneeR = Math.max(5, Math.min(85, Math.abs(kneeAngle - 4)));

      setKneeAngleLeft(kneeAngle);
      setKneeAngleRight(kneeR);
      setAnkleAngleLeft(Math.max(-5, Math.min(30, Math.round(14 + Math.cos(tick * 0.5) * 8))));
      setAnkleAngleRight(Math.max(-5, Math.min(30, Math.round(14 + Math.cos(tick * 0.5 + Math.PI) * 8))));

      // Strain calculation based on load and assist factor
      const effectiveTorque = isDisengaged ? 0 : currentConfig.assistTorqueNm;
      const baseStrain = (kneeAngle * 4) + (currentConfig.suitMassKg * 3) - (effectiveTorque * 2.5);
      const peakStrain = Math.max(120, Math.round(baseStrain + (Math.random() * 30)));

      setCurrentStrainN(peakStrain);
      setPeakLoadVal(peakStrain + 150);

      // Temperature
      const tempKnee = +(37.5 + (effectiveTorque * 0.05) + Math.sin(tick * 0.1)).toFixed(1);
      setKneeTempC(tempKnee);
      setAnkleTempC(+(tempKnee + 1.2).toFixed(1));

      // Battery slow drain
      setBatteryPct((b) => Math.max(5, +(b - 0.003).toFixed(2)));

      // History update
      setTelemetryHistory((prev) => [
        ...prev.slice(-40),
        {
          timeSec: tick,
          kneeAngleDeg: kneeAngle,
          ankleAngleDeg: 14,
          strainLoadN: peakStrain,
          assistTorqueNm: effectiveTorque,
          emgActivityPct: Math.round(35 + (peakStrain / 800) * 45),
          gaitPhasePct: (tick * 12) % 100,
        },
      ]);

      // Periodic Status Logging
      if (tick % 12 === 0) {
        const savings = Math.min(32, Math.max(8, Math.round((effectiveTorque / 90) * 28 + 5)));
        addLog(`Gait cycle nominal. Assist efficiency: ${savings}%.`, 'info');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isSimulating]);

  // Derived high-level stats
  const effectiveTorque = isEmergencyDisengaged ? 0 : config.assistTorqueNm;
  const metabolicSavingsPct = Math.min(32, Math.max(8, Math.round((effectiveTorque / 90) * 28 + 5)));
  const actuatorPowerPct = Math.round((effectiveTorque / 90) * 100);
  const batteryRemainingHours = 4.2;

  const handleSelectSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="font-sans antialiased min-h-screen flex flex-col selection:bg-cyan-500 selection:text-black bg-[#070A10] text-[#E5E7EB]">
      
      {/* TOP NAVIGATION */}
      <TopNav
        isSimulating={isSimulating}
        onToggleSim={() => {
          const next = !isSimulating;
          setIsSimulating(next);
          addLog(next ? 'Telemetry feed resumed.' : 'Telemetry feed paused.', 'info');
        }}
        audioEnabled={audioEnabled}
        onToggleAudio={handleToggleAudio}
        activeSection={activeSection}
        onSelectSection={handleSelectSection}
        missionTimeSec={missionTimeSec}
      />

      {/* MAIN CONTENT */}
      <main className="flex-grow max-w-7xl w-full mx-auto p-4 lg:p-6 space-y-6">
        
        {/* OVERVIEW / HERO RATIONALE */}
        <div id="overview">
          <HeroRationale
            config={config}
            metabolicSavingsPct={metabolicSavingsPct}
            peakLoadN={peakLoadVal}
            actuatorPowerPct={actuatorPowerPct}
            fatigueIndexPct={25}
          />
        </div>

        {/* DASHBOARD GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT COLUMN: CONTROLS & EVA MODES (1 Col) */}
          <div className="space-y-6">
            <div id="actuators">
              <SuitControls
                config={config}
                onChangeConfig={handleChangeConfig}
                onEmergencyDisengage={handleEmergencyDisengage}
                isEmergencyDisengaged={isEmergencyDisengaged}
              />
            </div>

            <HardwareDiagnostics
              kneeTempC={kneeTempC}
              ankleTempC={ankleTempC}
              batteryPct={batteryPct}
              batteryRemainingHours={batteryRemainingHours}
              currentDrawA={3.8}
              motorRpm={2850}
              harmonicBacklashArcmin={0.84}
            />
          </div>

          {/* RIGHT COLUMN: TELEMETRY CHARTS & REAL-TIME DATA (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Biomechanical Telemetry Charts */}
            <div id="telemetry">
              <TelemetryWaveform
                dataPoints={telemetryHistory}
                isSimulating={isSimulating}
                onClearBuffer={() => setTelemetryHistory([])}
              />
            </div>

            {/* REAL-TIME KINEMATIC DIAGRAM & OPERATIONAL LOGS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div id="kinematics">
                <KinematicRig
                  kneeAngleLeft={kneeAngleLeft}
                  kneeAngleRight={kneeAngleRight}
                  ankleAngleLeft={ankleAngleLeft}
                  ankleAngleRight={ankleAngleRight}
                  gaitPhasePct={gaitPhasePct}
                  mode={config.mode}
                  assistTorque={effectiveTorque}
                  strainLoadN={currentStrainN}
                />
              </div>

              <EventConsole
                logs={logs}
                onClearLogs={() => setLogs([])}
                onInjectAnomaly={handleInjectAnomaly}
                telemetryHistory={telemetryHistory}
              />

            </div>

          </div>

        </div>

        {/* METABOLIC WORKLOAD MODELING */}
        <div id="metabolic">
          <MetabolicMonitor
            config={config}
            metabolicSavingsPct={metabolicSavingsPct}
            currentStrainN={currentStrainN}
          />
        </div>

        {/* PROJECT SPECIFICATIONS & RATIONALE */}
        <div id="specifications">
          <ProjectSpecs />
        </div>

      </main>

      {/* FOOTER */}
      <footer className="glass-panel border-t border-gray-800 mt-8 py-4 px-4 text-center text-xs text-gray-500 font-mono">
        <p>BIO-MOVE: Biomechanical Joint-Assistance System for Lunar Analogue Operations</p>
      </footer>

    </div>
  );
}
