import React from 'react';
import { FileText } from 'lucide-react';

export const ProjectSpecs: React.FC = () => {
  return (
    <section className="glass-panel rounded-2xl p-6 space-y-4">
      <h3 className="text-base font-semibold text-white flex items-center gap-2">
        <FileText className="w-5 h-5 text-cyan-400" /> Project Rationale & System Specifications
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-300">
        <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800/80 space-y-2">
          <h4 className="font-semibold text-white text-xs uppercase font-mono text-cyan-400">
            1. Mechanical Architecture
          </h4>
          <p className="text-xs leading-relaxed text-gray-400">
            Utilizes carbon-composite structural framing coupled with brushless DC actuators at the knee and ankle joints,
            providing adaptive torque assistance during locomotion over irregular terrain.
          </p>
        </div>

        <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800/80 space-y-2">
          <h4 className="font-semibold text-white text-xs uppercase font-mono text-cyan-400">
            2. Sensor Array & Control Loop
          </h4>
          <p className="text-xs leading-relaxed text-gray-400">
            Incorporate high-frequency IMU units and strain gauges. Real-time gait detection algorithms predict swing phase
            momentum and supply localized torque assistance to minimize user exertion.
          </p>
        </div>

        <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800/80 space-y-2">
          <h4 className="font-semibold text-white text-xs uppercase font-mono text-cyan-400">
            3. Analogue Operational Goals
          </h4>
          <p className="text-xs leading-relaxed text-gray-400">
            Designed to extend EVA radius, safeguard joint integrity during repetitive strain scenarios, and provide telemetry
            feedback to support mission safety officers.
          </p>
        </div>
      </div>
    </section>
  );
};
