import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { SuitConfig } from '../types/telemetry';

interface HeroRationaleProps {
  config: SuitConfig;
  metabolicSavingsPct: number;
  peakLoadN: number;
  actuatorPowerPct: number;
  fatigueIndexPct: number;
}

export const HeroRationale: React.FC<HeroRationaleProps> = ({
  metabolicSavingsPct,
  peakLoadN,
  actuatorPowerPct,
}) => {
  return (
    <section className="glass-panel rounded-2xl p-6 relative overflow-hidden">
      <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
        
        {/* Left: Text & Rationale */}
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Operational Hazard Mitigation</span>
          </div>

          <h2 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
            Active Lower-Limb Assistance for Extravehicular Activity
          </h2>

          <p className="text-gray-300 text-sm leading-relaxed">
            In pressurized lunar suit environments, continuous counter-pressure and extra suit mass drastically increase
            metabolic expenditure and fatigue at the knee and ankle joints. <strong className="text-white font-semibold">BIO-MOVE</strong> integrates
            lightweight variable torque actuators and real-time kinematic strain monitoring to stabilize bio-joint load during
            analogue lunar traverses.
          </p>
        </div>

        {/* Right: Quick Metric Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full lg:w-auto font-mono shrink-0">
          
          <div className="bg-gray-900/90 border border-gray-800 rounded-xl p-3 text-center">
            <span className="text-xs text-gray-400 uppercase block mb-1">Metabolic Reduction</span>
            <span className="text-xl font-bold text-emerald-400 tabular-nums">
              -{metabolicSavingsPct}%
            </span>
          </div>

          <div className="bg-gray-900/90 border border-gray-800 rounded-xl p-3 text-center">
            <span className="text-xs text-gray-400 uppercase block mb-1">Peak Joint Load</span>
            <span className="text-xl font-bold text-amber-400 tabular-nums">
              {peakLoadN} N
            </span>
          </div>

          <div className="bg-gray-900/90 border border-gray-800 rounded-xl p-3 text-center col-span-2 sm:col-span-1">
            <span className="text-xs text-gray-400 uppercase block mb-1">Actuator Assist</span>
            <span className="text-xl font-bold text-cyan-400 tabular-nums">
              {actuatorPowerPct}%
            </span>
          </div>

        </div>

      </div>
    </section>
  );
};
