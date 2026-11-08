import React from 'react';
import { Sliders, Footprints, TrendingUp, Archive, BatteryCharging, Orbit, AlertOctagon } from 'lucide-react';
import { EvaMode, GravityPreset, GaitStyle, SuitConfig } from '../types/telemetry';

interface SuitControlsProps {
  config: SuitConfig;
  onChangeConfig: (newConfig: Partial<SuitConfig>) => void;
  onEmergencyDisengage: () => void;
  isEmergencyDisengaged: boolean;
}

export const SuitControls: React.FC<SuitControlsProps> = ({
  config,
  onChangeConfig,
  onEmergencyDisengage,
  isEmergencyDisengaged,
}) => {
  const modes: { id: EvaMode; label: string; sub: string; icon: React.ReactNode }[] = [
    {
      id: 'flat',
      label: 'Lunar Regolith',
      sub: 'Flat/Standard Traverse',
      icon: <Footprints className="w-3.5 h-3.5" />,
    },
    {
      id: 'slope',
      label: 'Crater Slope',
      sub: 'High Incline Torque',
      icon: <TrendingUp className="w-3.5 h-3.5" />,
    },
    {
      id: 'sample',
      label: 'Sample Retrieval',
      sub: 'Crouch / Bending Assist',
      icon: <Archive className="w-3.5 h-3.5" />,
    },
    {
      id: 'passive',
      label: 'Passive Eco',
      sub: 'Dampening / Low Power',
      icon: <BatteryCharging className="w-3.5 h-3.5" />,
    },
  ];

  const handleModeSelect = (mode: EvaMode) => {
    let torque = config.assistTorqueNm;
    if (mode === 'flat') torque = 45;
    if (mode === 'slope') torque = 75;
    if (mode === 'sample') torque = 60;
    if (mode === 'passive') torque = 15;

    onChangeConfig({
      mode,
      assistTorqueNm: torque,
    });
  };

  return (
    <div className="glass-panel rounded-2xl p-5 space-y-4">
      {/* Heading */}
      <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider flex items-center justify-between border-b border-gray-800 pb-3">
        <span className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" /> Suit Actuation & Modes
        </span>
        {isEmergencyDisengaged && (
          <span className="text-[10px] font-mono text-rose-400 bg-rose-950 border border-rose-800 px-2 py-0.5 rounded animate-pulse">
            DISENGAGED
          </span>
        )}
      </h3>

      {/* Terrain Mode Grid */}
      <div className="space-y-3">
        <label className="text-xs text-gray-400 font-mono">Select Operational Terrain Mode:</label>
        <div className="grid grid-cols-2 gap-2">
          {modes.map((m) => {
            const isActive = config.mode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => handleModeSelect(m.id)}
                className={`p-2.5 rounded-xl text-left font-medium text-xs flex flex-col gap-1 transition cursor-pointer ${
                  isActive
                    ? 'bg-cyan-950/60 border border-cyan-500 text-cyan-300'
                    : 'bg-gray-900 border border-gray-800 text-gray-400 hover:border-gray-700'
                }`}
              >
                <span className="font-bold flex items-center gap-1.5 text-white">
                  {m.icon} {m.label}
                </span>
                <span className="text-[10px] text-gray-400 font-mono">{m.sub}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Joint Strain Interactive Sliders */}
      <div className="space-y-4 pt-3 border-t border-gray-800">
        <div>
          <div className="flex justify-between text-xs font-mono mb-1">
            <span className="text-gray-300">Target Assist Torque</span>
            <span className="text-cyan-400 font-bold tabular-nums">
              {config.assistTorqueNm} Nm
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="90"
            value={config.assistTorqueNm}
            onChange={(e) => onChangeConfig({ assistTorqueNm: parseInt(e.target.value) })}
            className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-mono mb-1">
            <span className="text-gray-300">Simulated Extra Suit Weight</span>
            <span className="text-amber-400 font-bold tabular-nums">
              {config.suitMassKg} kg
            </span>
          </div>
          <input
            type="range"
            min="15"
            max="60"
            value={config.suitMassKg}
            onChange={(e) => onChangeConfig({ suitMassKg: parseInt(e.target.value) })}
            className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />
        </div>

        {/* Gravity Preset selector */}
        <div className="pt-2 border-t border-gray-800/80 flex items-center justify-between text-xs font-mono">
          <span className="text-gray-400 flex items-center gap-1">
            <Orbit className="w-3.5 h-3.5 text-cyan-400" /> Gravity:
          </span>
          <div className="flex bg-gray-950 p-0.5 rounded border border-gray-800 text-[11px]">
            {(['lunar', 'mars', 'earth'] as GravityPreset[]).map((g) => (
              <button
                key={g}
                onClick={() => onChangeConfig({ gravity: g })}
                className={`px-2 py-0.5 rounded cursor-pointer transition ${
                  config.gravity === g
                    ? 'bg-cyan-950 border border-cyan-800 text-cyan-300 font-bold'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {g === 'lunar' ? '0.16g' : g === 'mars' ? '0.38g' : '1.0g'}
              </button>
            ))}
          </div>
        </div>

        {/* Emergency Stop Button */}
        <div className="pt-1">
          <button
            onClick={onEmergencyDisengage}
            className={`w-full py-2 px-3 rounded-xl text-xs font-mono font-semibold tracking-wider flex items-center justify-center gap-2 transition cursor-pointer border ${
              isEmergencyDisengaged
                ? 'bg-rose-950/80 border-rose-700 text-rose-300 hover:bg-rose-900/80'
                : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-rose-400 hover:border-rose-900'
            }`}
          >
            <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
            {isEmergencyDisengaged
              ? 'RE-ENGAGE ACTUATORS (NORMAL)'
              : 'ACTUATOR EMERGENCY DISENGAGE'}
          </button>
        </div>

      </div>
    </div>
  );
};
