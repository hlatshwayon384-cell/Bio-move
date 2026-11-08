import React, { useState } from 'react';
import { User, Eye, Info } from 'lucide-react';
import { EvaMode } from '../types/telemetry';

interface KinematicRigProps {
  kneeAngleLeft: number;
  kneeAngleRight: number;
  ankleAngleLeft: number;
  ankleAngleRight: number;
  gaitPhasePct: number;
  mode: EvaMode;
  assistTorque: number;
  strainLoadN: number;
}

export const KinematicRig: React.FC<KinematicRigProps> = ({
  kneeAngleLeft,
  kneeAngleRight,
  ankleAngleLeft,
  ankleAngleRight,
  gaitPhasePct,
  assistTorque,
  strainLoadN,
}) => {
  const [viewPlane, setViewPlane] = useState<'sagittal' | 'coronal'>('sagittal');
  const [selectedJoint, setSelectedJoint] = useState<'knee' | 'ankle'>('knee');

  const isStrainHigh = strainLoadN > 540;

  // Kinematic calculations for dynamic skeleton animation
  const basePhase = (gaitPhasePct / 100) * Math.PI * 2;
  const leftKneeY = 80 + Math.sin(basePhase) * 4;
  const leftAnkleY = 110 + Math.sin(basePhase) * 3;
  const rightKneeY = 80 + Math.sin(basePhase + Math.PI) * 4;
  const rightAnkleY = 110 + Math.sin(basePhase + Math.PI) * 3;

  return (
    <div className="glass-panel rounded-2xl p-5 space-y-3">
      <div className="flex items-center justify-between border-b border-gray-800 pb-2">
        <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider flex items-center gap-2">
          <User className="w-4 h-4 text-cyan-400" /> Joint Strain Topology
        </h3>
        
        {/* Plane Selector */}
        <div className="flex items-center bg-gray-950 p-0.5 rounded border border-gray-800 text-[10px] font-mono">
          <button
            onClick={() => setViewPlane('sagittal')}
            className={`px-2 py-0.5 rounded cursor-pointer transition ${
              viewPlane === 'sagittal' ? 'bg-gray-800 text-cyan-300 font-bold' : 'text-gray-400'
            }`}
          >
            Lateral
          </button>
          <button
            onClick={() => setViewPlane('coronal')}
            className={`px-2 py-0.5 rounded cursor-pointer transition ${
              viewPlane === 'coronal' ? 'bg-gray-800 text-cyan-300 font-bold' : 'text-gray-400'
            }`}
          >
            Frontal
          </button>
        </div>
      </div>

      <div className="relative bg-gray-950 rounded-xl border border-gray-800 p-4 h-52 flex items-center justify-center overflow-hidden">
        
        {/* Visual Skeleton SVG */}
        <svg viewBox="0 0 100 120" className="h-full stroke-current text-gray-600 fill-none select-none" strokeWidth="2">
          {/* Spine & Hips */}
          <line x1="50" y1="10" x2="50" y2="50" />
          <line x1="30" y1="50" x2="70" y2="50" />
          
          {/* Left Leg (Cyan) */}
          <line
            x1="35"
            y1="50"
            x2="32"
            y2={leftKneeY}
            className="stroke-cyan-500 cursor-pointer"
            strokeWidth="3"
            onClick={() => setSelectedJoint('knee')}
          />
          <circle
            cx="32"
            cy={leftKneeY}
            r="4.5"
            className="fill-cyan-400 cursor-pointer animate-pulse"
            onClick={() => setSelectedJoint('knee')}
          />
          <line
            x1="32"
            y1={leftKneeY}
            x2="30"
            y2={leftAnkleY}
            className="stroke-cyan-500 cursor-pointer"
            strokeWidth="2.5"
            onClick={() => setSelectedJoint('ankle')}
          />
          <circle
            cx="30"
            cy={leftAnkleY}
            r="3.5"
            className="fill-cyan-400 cursor-pointer"
            onClick={() => setSelectedJoint('ankle')}
          />

          {/* Right Leg (Emerald) */}
          <line x1="65" y1="50" x2="68" y2={rightKneeY} className="stroke-emerald-500" strokeWidth="3" />
          <circle cx="68" cy={rightKneeY} r="4.5" className="fill-emerald-400" />
          <line x1="68" y1={rightKneeY} x2="70" y2={rightAnkleY} className="stroke-emerald-500" strokeWidth="2.5" />
          <circle cx="70" cy={rightAnkleY} r="3.5" className="fill-emerald-400" />
        </svg>

        {/* Live Knee Readout Overlays */}
        <div className="absolute top-3 left-3 text-[10px] font-mono space-y-1 bg-gray-900/60 p-1.5 rounded border border-gray-800/80">
          <p className="text-gray-400">
            Left Knee: <span className="text-cyan-400 font-bold tabular-nums">{kneeAngleLeft}°</span>
          </p>
          <p className="text-gray-400">
            Right Knee: <span className="text-emerald-400 font-bold tabular-nums">{kneeAngleRight}°</span>
          </p>
          <p className="text-gray-500 text-[9px]">
            Torque: <span className="text-amber-400 font-semibold">{assistTorque} Nm</span>
          </p>
        </div>

        {/* Joint Status Badge */}
        <div className="absolute bottom-3 right-3 text-[10px] font-mono text-right">
          <span
            className={`inline-block px-2 py-0.5 rounded border font-semibold tracking-wider ${
              isStrainHigh
                ? 'bg-amber-950 border-amber-800 text-amber-400'
                : 'bg-emerald-950 border-emerald-800 text-emerald-400'
            }`}
          >
            {isStrainHigh ? 'ELEVATED STRAIN' : 'OPTIMAL LOAD'}
          </span>
        </div>

      </div>

      <div className="flex justify-between items-center text-[10px] font-mono text-gray-500 px-1">
        <span>Gait Phase: Stance / Swing ({gaitPhasePct}%)</span>
        <span className="text-cyan-400">Click joints to inspect load</span>
      </div>
    </div>
  );
};
