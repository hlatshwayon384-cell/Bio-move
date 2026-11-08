export type EvaMode = 'flat' | 'slope' | 'sample' | 'passive';

export type GravityPreset = 'lunar' | 'mars' | 'earth';

export type GaitStyle = 'reciprocal' | 'lunar_lope' | 'crouch' | 'incline_climb';

export interface JointDiagnostics {
  id: 'knee_left' | 'knee_right' | 'ankle_left' | 'ankle_right' | 'hip_core';
  name: string;
  angleDeg: number;
  torqueNm: number;
  motorTempC: number;
  currentDrawA: number;
  strainLoadN: number;
  health: 'optimal' | 'nominal' | 'elevated' | 'warning';
}

export interface TelemetryPoint {
  timeSec: number;
  kneeAngleDeg: number;
  ankleAngleDeg: number;
  strainLoadN: number;
  assistTorqueNm: number;
  emgActivityPct: number;
  gaitPhasePct: number;
}

export interface TelemetryLog {
  id: string;
  timestamp: string;
  type: 'info' | 'nominal' | 'warning' | 'alert';
  message: string;
}

export interface SuitConfig {
  mode: EvaMode;
  assistTorqueNm: number;
  suitMassKg: number;
  gravity: GravityPreset;
  gaitStyle: GaitStyle;
  assistTimingOffset: number; // % of gait cycle (0 - 50%)
  peakTorqueLimitNm: number;
  dampingFactor: number;
}
