import React from 'react';
import { Cpu } from 'lucide-react';

interface HardwareDiagnosticsProps {
  kneeTempC: number;
  ankleTempC: number;
  batteryPct: number;
  batteryRemainingHours: number;
  currentDrawA: number;
  motorRpm: number;
  harmonicBacklashArcmin: number;
}

export const HardwareDiagnostics: React.FC<HardwareDiagnosticsProps> = ({
  kneeTempC,
  ankleTempC,
  batteryPct,
  batteryRemainingHours,
}) => {
  return (
    <div className="glass-panel rounded-2xl p-5 space-y-3">
      <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider flex items-center gap-2">
        <Cpu className="w-4 h-4 text-emerald-400" /> Hardware Health
      </h3>
      
      <div className="space-y-2 text-xs font-mono">
        <div className="flex justify-between items-center p-2 rounded bg-gray-900/60 border border-gray-800/80">
          <span className="text-gray-400">Knee Motor Temp</span>
          <span className="text-emerald-400 tabular-nums">{kneeTempC.toFixed(1)} °C</span>
        </div>
        <div className="flex justify-between items-center p-2 rounded bg-gray-900/60 border border-gray-800/80">
          <span className="text-gray-400">Ankle Actuator Temp</span>
          <span className="text-emerald-400 tabular-nums">{ankleTempC.toFixed(1)} °C</span>
        </div>
        <div className="flex justify-between items-center p-2 rounded bg-gray-900/60 border border-gray-800/80">
          <span className="text-gray-400">Battery Pack Reserve</span>
          <span className="text-cyan-400 tabular-nums">
            {batteryPct.toFixed(0)}% ({batteryRemainingHours.toFixed(1)} hrs)
          </span>
        </div>
      </div>
    </div>
  );
};
