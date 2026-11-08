import React from 'react';
import { Heart, Flame, Shield, TrendingDown } from 'lucide-react';
import { SuitConfig } from '../types/telemetry';

interface MetabolicMonitorProps {
  config: SuitConfig;
  metabolicSavingsPct: number;
  currentStrainN: number;
}

export const MetabolicMonitor: React.FC<MetabolicMonitorProps> = ({
  config,
  metabolicSavingsPct,
}) => {
  // Biomechanical empirical estimation model
  // Baseline metabolic power for pressurized Apollo A7L/EMU suit in lunar gravity: ~5.8 W/kg
  const unassistedPowerWkg = 5.8 + (config.suitMassKg - 25) * 0.08 + (config.mode === 'slope' ? 2.1 : 0);
  const assistFactor = (config.assistTorqueNm / 90) * (metabolicSavingsPct / 100);
  const assistedPowerWkg = Math.max(3.2, unassistedPowerWkg * (1 - assistFactor));

  // Estimated Heart Rate
  const unassistedHr = Math.round(110 + unassistedPowerWkg * 8.5);
  const assistedHr = Math.round(95 + assistedPowerWkg * 7.2);

  // Oxygen Consumption (VO2 in mL/kg/min)
  const assistedVo2 = (assistedPowerWkg * 2.95).toFixed(1);
  const unassistedVo2 = (unassistedPowerWkg * 2.95).toFixed(1);

  // Cartilage Stress Alleviation
  const cartilageAlleviationPct = Math.min(42, Math.round((config.assistTorqueNm / 90) * 38 + 4));

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h2 className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Heart className="w-4 h-4 text-emerald-400" /> Astronaut Metabolic Workload & Energy Savings
        </h2>
        <span className="text-[10px] font-mono text-cyan-400">MODEL: BIO-CALC 3.1</span>
      </div>

      {/* Primary Comparison Bars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
        
        {/* Metabolic Power Bar */}
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 space-y-2">
          <div className="flex justify-between text-slate-400">
            <span>METABOLIC POWER</span>
            <span className="text-emerald-400 font-bold">-{metabolicSavingsPct}%</span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-400 tabular-nums">
              {assistedPowerWkg.toFixed(2)}
            </span>
            <span className="text-[10px] text-slate-500 uppercase">W/kg</span>
          </div>

          <div className="space-y-1 text-[10px]">
            <div className="flex justify-between text-slate-500">
              <span>Unassisted Suit:</span>
              <span className="text-slate-400 tabular-nums">{unassistedPowerWkg.toFixed(2)} W/kg</span>
            </div>
            <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden flex">
              <div
                className="bg-emerald-400 h-full"
                style={{ width: `${(assistedPowerWkg / unassistedPowerWkg) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Heart Rate Estimate */}
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 space-y-2">
          <div className="flex justify-between text-slate-400">
            <span>HEART RATE ESTIMATE</span>
            <span className="text-cyan-400 font-bold">-{unassistedHr - assistedHr} BPM</span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-cyan-400 tabular-nums">{assistedHr}</span>
            <span className="text-[10px] text-slate-500 uppercase">BPM</span>
          </div>

          <div className="space-y-1 text-[10px]">
            <div className="flex justify-between text-slate-500">
              <span>Unassisted Baseline:</span>
              <span className="text-rose-400/80 tabular-nums">{unassistedHr} BPM</span>
            </div>
            <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden flex">
              <div
                className="bg-cyan-400 h-full"
                style={{ width: `${(assistedHr / unassistedHr) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Oxygen Uptake (VO2) */}
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 space-y-2">
          <div className="flex justify-between text-slate-400">
            <span>O2 CONSUMPTION (VO2)</span>
            <span className="text-indigo-400 font-bold">PLSS O2 SAVER</span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-indigo-400 tabular-nums">{assistedVo2}</span>
            <span className="text-[10px] text-slate-500 uppercase">mL/kg/min</span>
          </div>

          <div className="space-y-1 text-[10px]">
            <div className="flex justify-between text-slate-500">
              <span>Unassisted Rate:</span>
              <span className="text-slate-400 tabular-nums">{unassistedVo2} mL/kg/min</span>
            </div>
            <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden flex">
              <div
                className="bg-indigo-400 h-full"
                style={{ width: `${(parseFloat(assistedVo2) / parseFloat(unassistedVo2)) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

      </div>

      {/* Physiological Impact Narrative */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs font-mono text-slate-400">
        <div className="flex items-start gap-2 bg-slate-950 p-2.5 rounded border border-slate-800/80">
          <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-slate-200 font-semibold block text-[11px]">Patellofemoral Joint Relief:</span>
            <span>Reduced peak cartilage shear stress by <strong className="text-emerald-400">{cartilageAlleviationPct}%</strong> during stance flexion.</span>
          </div>
        </div>

        <div className="flex items-start gap-2 bg-slate-950 p-2.5 rounded border border-slate-800/80">
          <TrendingDown className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-slate-200 font-semibold block text-[11px]">PLSS Consumable Endurance:</span>
            <span>Extends portable life support system mission limit by approximately <strong className="text-cyan-400">+1.4 hours</strong>.</span>
          </div>
        </div>
      </div>

    </div>
  );
};
