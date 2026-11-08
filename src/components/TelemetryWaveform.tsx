import React, { useState, useRef } from 'react';
import { LineChart } from 'lucide-react';
import { TelemetryPoint } from '../types/telemetry';

interface TelemetryWaveformProps {
  dataPoints: TelemetryPoint[];
  isSimulating: boolean;
  onClearBuffer: () => void;
}

export const TelemetryWaveform: React.FC<TelemetryWaveformProps> = ({
  dataPoints,
}) => {
  const [showKnee, setShowKnee] = useState(true);
  const [showStrain, setShowStrain] = useState(true);
  const [showTorque, setShowTorque] = useState(false);
  const [windowSec, setWindowSec] = useState<number>(20);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const visibleData = dataPoints.slice(-windowSec);
  const count = visibleData.length;

  const svgWidth = 800;
  const svgHeight = 260;
  const paddingLeft = 40;
  const paddingRight = 45;
  const paddingTop = 20;
  const paddingBottom = 30;

  const plotWidth = svgWidth - paddingLeft - paddingRight;
  const plotHeight = svgHeight - paddingTop - paddingBottom;

  const getX = (index: number) => {
    if (count <= 1) return paddingLeft;
    return paddingLeft + (index / (count - 1)) * plotWidth;
  };

  const getYAngle = (angle: number) => {
    const clamped = Math.max(0, Math.min(90, angle));
    return paddingTop + (1 - clamped / 90) * plotHeight;
  };

  const getYStrain = (strain: number) => {
    const minS = 100;
    const maxS = 800;
    const norm = Math.max(0, Math.min(1, (strain - minS) / (maxS - minS)));
    return paddingTop + (1 - norm) * plotHeight;
  };

  const getYTorque = (torque: number) => {
    const clamped = Math.max(0, Math.min(100, torque));
    return paddingTop + (1 - clamped / 100) * plotHeight;
  };

  const generatePath = (getYFn: (val: number) => number, key: keyof TelemetryPoint) => {
    if (visibleData.length === 0) return '';
    return visibleData.reduce((acc, point, idx) => {
      const x = getX(idx);
      const y = getYFn(point[key] as number);
      return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
    }, '');
  };

  const generateArea = (getYFn: (val: number) => number, key: keyof TelemetryPoint) => {
    if (visibleData.length === 0) return '';
    const line = generatePath(getYFn, key);
    const lastX = getX(visibleData.length - 1);
    const firstX = getX(0);
    const bottomY = paddingTop + plotHeight;
    return `${line} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!containerRef.current || count === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const relativeX = (mouseX / rect.width) * svgWidth;

    if (relativeX < paddingLeft || relativeX > svgWidth - paddingRight) {
      setHoverIndex(null);
      return;
    }

    const ratio = (relativeX - paddingLeft) / plotWidth;
    const idx = Math.round(ratio * (count - 1));
    setHoverIndex(Math.max(0, Math.min(count - 1, idx)));
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  const hoveredPoint = hoverIndex !== null ? visibleData[hoverIndex] : visibleData[count - 1];

  return (
    <div className="glass-panel rounded-2xl p-5 space-y-4">
      {/* Header with Title and Legend */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-800 pb-3">
        <div className="flex items-center gap-2">
          <LineChart className="w-5 h-5 text-cyan-400" />
          <h3 className="font-semibold text-white text-sm uppercase tracking-wider">
            Joint Moment & Flexion Stream
          </h3>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowKnee(!showKnee)}
            className={`inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded transition cursor-pointer ${
              showKnee
                ? 'text-cyan-400 bg-cyan-950/50 border border-cyan-800'
                : 'text-gray-500 bg-gray-900 border border-gray-800 opacity-60'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span> Knee Angle (deg)
          </button>

          <button
            onClick={() => setShowStrain(!showStrain)}
            className={`inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded transition cursor-pointer ${
              showStrain
                ? 'text-amber-400 bg-amber-950/50 border border-amber-800'
                : 'text-gray-500 bg-gray-900 border border-gray-800 opacity-60'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400"></span> Strain Index (N)
          </button>

          <button
            onClick={() => setShowTorque(!showTorque)}
            className={`inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded transition cursor-pointer ${
              showTorque
                ? 'text-emerald-400 bg-emerald-950/50 border border-emerald-800'
                : 'text-gray-500 bg-gray-900 border border-gray-800 opacity-60'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Torque (Nm)
          </button>
        </div>
      </div>

      {/* Responsive Canvas/SVG Chart Container */}
      <div
        ref={containerRef}
        className="relative w-full h-64 sm:h-72 bg-gray-950/90 rounded-xl border border-gray-800 overflow-hidden"
      >
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full cursor-crosshair select-none"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <defs>
            <linearGradient id="cyanArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines horizontal */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = paddingTop + ratio * plotHeight;
            const deg = Math.round((1 - ratio) * 90);
            const loadN = Math.round(100 + (1 - ratio) * 700);
            return (
              <g key={i}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={svgWidth - paddingRight}
                  y2={y}
                  stroke="rgba(255, 255, 255, 0.05)"
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 6}
                  y={y + 3}
                  textAnchor="end"
                  fill="#06B6D4"
                  fontSize="10"
                  fontFamily="JetBrains Mono"
                >
                  {deg}°
                </text>
                <text
                  x={svgWidth - paddingRight + 6}
                  y={y + 3}
                  textAnchor="start"
                  fill="#F59E0B"
                  fontSize="10"
                  fontFamily="JetBrains Mono"
                >
                  {loadN}
                </text>
              </g>
            );
          })}

          {/* Knee Angle Area & Line */}
          {showKnee && (
            <>
              <path d={generateArea(getYAngle, 'kneeAngleDeg')} fill="url(#cyanArea)" />
              <path
                d={generatePath(getYAngle, 'kneeAngleDeg')}
                fill="none"
                stroke="#06B6D4"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </>
          )}

          {/* Strain Index Line (Dashed) */}
          {showStrain && (
            <path
              d={generatePath(getYStrain, 'strainLoadN')}
              fill="none"
              stroke="#F59E0B"
              strokeWidth="2"
              strokeDasharray="4 4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Assist Torque Line */}
          {showTorque && (
            <path
              d={generatePath(getYTorque, 'assistTorqueNm')}
              fill="none"
              stroke="#10B981"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Crosshair indicator */}
          {hoverIndex !== null && (
            <g>
              <line
                x1={getX(hoverIndex)}
                y1={paddingTop}
                x2={getX(hoverIndex)}
                y2={paddingTop + plotHeight}
                stroke="rgba(255, 255, 255, 0.3)"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              {showKnee && (
                <circle
                  cx={getX(hoverIndex)}
                  cy={getYAngle(visibleData[hoverIndex].kneeAngleDeg)}
                  r="3.5"
                  fill="#06B6D4"
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                />
              )}
              {showStrain && (
                <circle
                  cx={getX(hoverIndex)}
                  cy={getYStrain(visibleData[hoverIndex].strainLoadN)}
                  r="3.5"
                  fill="#F59E0B"
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                />
              )}
            </g>
          )}

          {/* Time axis labels */}
          <text x={paddingLeft} y={svgHeight - 10} fill="#9CA3AF" fontSize="10" fontFamily="JetBrains Mono">
            -{windowSec}s
          </text>
          <text x={svgWidth / 2} y={svgHeight - 10} textAnchor="middle" fill="#9CA3AF" fontSize="10" fontFamily="JetBrains Mono">
            -{Math.round(windowSec / 2)}s
          </text>
          <text x={svgWidth - paddingRight} y={svgHeight - 10} textAnchor="end" fill="#9CA3AF" fontSize="10" fontFamily="JetBrains Mono">
            0s (LIVE)
          </text>
        </svg>

        {/* Hover data HUD */}
        {hoveredPoint && (
          <div className="absolute top-2 right-12 bg-gray-900/90 border border-gray-800 rounded-lg p-2 text-[10px] font-mono space-y-0.5 pointer-events-none shadow-md">
            <div className="text-gray-400">Time: +{hoveredPoint.timeSec}s</div>
            {showKnee && <div className="text-cyan-400">Knee Angle: {hoveredPoint.kneeAngleDeg}°</div>}
            {showStrain && <div className="text-amber-400">Strain Load: {hoveredPoint.strainLoadN} N</div>}
            {showTorque && <div className="text-emerald-400">Torque Assist: {hoveredPoint.assistTorqueNm} Nm</div>}
          </div>
        )}
      </div>
    </div>
  );
};
