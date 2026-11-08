import React from 'react';
import { Activity, Play, Pause, Volume2, VolumeX, Radio } from 'lucide-react';

interface TopNavProps {
  isSimulating: boolean;
  onToggleSim: () => void;
  audioEnabled: boolean;
  onToggleAudio: () => void;
  activeSection: string;
  onSelectSection: (sectionId: string) => void;
  missionTimeSec: number;
}

export const TopNav: React.FC<TopNavProps> = ({
  isSimulating,
  onToggleSim,
  audioEnabled,
  onToggleAudio,
  activeSection,
  onSelectSection,
  missionTimeSec,
}) => {
  const formatTime = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600).toString().padStart(2, '0');
    const mins = Math.floor((totalSec % 3600) / 60).toString().padStart(2, '0');
    const secs = (totalSec % 60).toString().padStart(2, '0');
    return `T+${hrs}:${mins}:${secs}`;
  };

  const navItems = [
    { id: 'telemetry', label: 'Telemetry Stream' },
    { id: 'kinematics', label: 'Kinematic Rig' },
    { id: 'actuators', label: 'Actuator Tuning' },
    { id: 'metabolic', label: 'Metabolic Workload' },
    { id: 'specifications', label: 'Specifications' },
  ];

  return (
    <header className="glass-panel sticky top-0 z-50 border-b border-gray-800 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        
        {/* Brand Lockup */}
        <div className="flex items-center space-x-3 shrink-0">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center font-bold text-white shadow-lg glow-cyan">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-wider text-white flex items-center gap-2">
              BIO-MOVE <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono">v2.4-SIM</span>
            </h1>
            <p className="text-xs text-gray-400 font-mono hidden sm:block">
              Biomechanical Joint-Assistance System for Lunar Analogue Operations
            </p>
          </div>
        </div>

        {/* Section Navigation */}
        <nav className="hidden lg:flex items-center gap-5 text-xs font-mono text-gray-400">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelectSection(item.id)}
              className={`hover:text-cyan-300 transition-colors cursor-pointer whitespace-nowrap pb-0.5 ${
                activeSection === item.id
                  ? 'text-cyan-400 font-bold border-b border-cyan-400'
                  : ''
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Status Controls */}
        <div className="flex items-center space-x-3 shrink-0">
          
          {/* Mission Elapsed Time */}
          <div className="hidden md:flex items-center space-x-1.5 bg-gray-900/80 px-2.5 py-1.5 rounded-lg border border-gray-800 text-xs font-mono text-gray-300">
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-gray-400">MET:</span>
            <span className="text-cyan-300 tabular-nums">{formatTime(missionTimeSec)}</span>
          </div>

          {/* Telemetry Status Indicator */}
          <div className="flex items-center space-x-2 bg-gray-900/80 px-3 py-1.5 rounded-full border border-gray-800 text-xs font-mono">
            <span className="relative flex h-2.5 w-2.5">
              {isSimulating && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              )}
              <span
                className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                  isSimulating ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              ></span>
            </span>
            <span
              className={`font-medium ${
                isSimulating ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {isSimulating ? 'LIVE TELEMETRY' : 'SIM PAUSED'}
            </span>
          </div>

          {/* Audio Chime Toggle */}
          <button
            onClick={onToggleAudio}
            title={audioEnabled ? 'Mute Telemetry Clicks' : 'Enable Telemetry Audio'}
            className={`p-1.5 rounded-lg border text-xs font-mono transition-colors cursor-pointer ${
              audioEnabled
                ? 'bg-cyan-950/80 border-cyan-700 text-cyan-300'
                : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-gray-200'
            }`}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Toggle Simulation Button */}
          <button
            onClick={onToggleSim}
            className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold transition shadow-md cursor-pointer whitespace-nowrap"
          >
            {isSimulating ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause Sim</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Resume Sim</span>
              </>
            )}
          </button>

        </div>

      </div>
    </header>
  );
};
