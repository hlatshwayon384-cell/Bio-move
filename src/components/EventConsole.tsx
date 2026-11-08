import React, { useRef, useEffect } from 'react';
import { Terminal, Download, ShieldAlert } from 'lucide-react';
import { TelemetryLog, TelemetryPoint } from '../types/telemetry';

interface EventConsoleProps {
  logs: TelemetryLog[];
  onClearLogs: () => void;
  onInjectAnomaly: () => void;
  telemetryHistory: TelemetryPoint[];
}

export const EventConsole: React.FC<EventConsoleProps> = ({
  logs,
  onClearLogs,
  onInjectAnomaly,
  telemetryHistory,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const exportCSV = () => {
    const headers = 'TimeSec,KneeAngleDeg,AnkleAngleDeg,StrainLoadN,AssistTorqueNm,EmgActivityPct\n';
    const rows = telemetryHistory
      .map(
        (p) =>
          `${p.timeSec},${p.kneeAngleDeg},${p.ankleAngleDeg},${p.strainLoadN},${p.assistTorqueNm},${p.emgActivityPct}`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bio_move_telemetry_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="glass-panel rounded-2xl p-5 space-y-3 flex flex-col justify-between">
      
      {/* Console Header */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-2">
        <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider flex items-center gap-2">
          <Terminal className="w-4 h-4 text-amber-400" /> Event Telemetry Console
        </h3>
        <div className="flex items-center gap-3">
          <button
            onClick={onInjectAnomaly}
            className="text-[10px] text-amber-400/90 hover:text-amber-300 font-mono cursor-pointer flex items-center gap-1"
            title="Inject simulated regolith slip to test joint damping recovery"
          >
            <ShieldAlert className="w-3 h-3" /> Simulate Slip
          </button>
          <button
            onClick={onClearLogs}
            className="text-[10px] text-gray-500 hover:text-gray-300 font-mono cursor-pointer"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Console Feed */}
      <div
        ref={scrollRef}
        className="bg-gray-950 border border-gray-800/80 rounded-xl p-3 h-40 overflow-y-auto font-mono text-[11px] space-y-1.5 text-gray-400 select-text"
      >
        {logs.length === 0 ? (
          <p className="text-gray-600 text-center py-6">Telemetry buffer cleared.</p>
        ) : (
          logs.map((log) => (
            <p key={log.id} className="leading-relaxed">
              <span className="text-gray-500">[{log.timestamp}]</span>{' '}
              <span
                className={
                  log.type === 'alert'
                    ? 'text-rose-400 font-semibold'
                    : log.type === 'warning'
                    ? 'text-amber-400'
                    : log.type === 'nominal'
                    ? 'text-cyan-400'
                    : 'text-gray-300'
                }
              >
                {log.message}
              </span>
            </p>
          ))
        )}
      </div>

      {/* Export footer */}
      <div className="flex justify-between items-center text-[10px] font-mono text-gray-500 pt-1">
        <span>Logged Events: {logs.length}</span>
        <button
          onClick={exportCSV}
          className="text-gray-400 hover:text-cyan-400 transition cursor-pointer flex items-center gap-1"
        >
          <Download className="w-3 h-3" /> Export CSV
        </button>
      </div>

    </div>
  );
};
