import { MachineState } from '../types';

export const COLORS = {
  // Core palette — industrial dark with surgical precision
  bg: '#0D1117',          // deep gunmetal
  surface: '#161B22',     // raised surface
  surfaceHigh: '#1C2330', // elevated card
  border: '#2D3748',      // subtle border
  borderLight: '#3D4A5C',

  // Brand
  accent: '#00D4FF',      // electric cyan — the "live" colour
  accentDim: '#00A3C4',

  // State colors — inspired by industrial HMI panels
  operation: '#00C853',   // green
  waiting: '#FFB300',     // amber
  replacement: '#2979FF', // blue
  error: '#FF1744',       // red
  stopped: '#546E7A',     // slate
  optionalStop: '#9C27B0',// purple

  // Text
  textPrimary: '#F0F6FC',
  textSecondary: '#8B949E',
  textTertiary: '#484F58',

  // Alert backgrounds (subtle tints)
  errorBg: '#1A0A0A',
  waitingBg: '#1A1300',
  escalationBg: '#1A1020',
  assistanceBg: '#0A1020',

  // Misc
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(0,0,0,0.7)',
};

export const STATE_COLORS: Record<MachineState, string> = {
  Operation: COLORS.operation,
  Waiting: COLORS.waiting,
  Replacement: COLORS.replacement,
  Error: COLORS.error,
  Stopped: COLORS.stopped,
  'Optional Stop': COLORS.optionalStop,
};

export const STATE_BG: Record<MachineState, string> = {
  Operation: '#0A2010',
  Waiting: '#1A1300',
  Replacement: '#0A1030',
  Error: '#200A0A',
  Stopped: '#0E1417',
  'Optional Stop': '#170A20',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const RADIUS = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 999,
};

export const FONT_SIZE = {
  xs: 10,
  sm: 12,
  md: 14,
  base: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  xxxl: 36,
};

export const FONT_WEIGHT = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  black: '900' as const,
};
