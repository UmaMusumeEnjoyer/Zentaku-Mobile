/**
 * src/styles/theme.ts
 *
 * Global color tokens — mirrors pbl5_webFE/src/styles/theme.css
 * Use the SEMANTIC section in your StyleSheet objects, never raw primitives.
 */

// ============================================================
// LAYER 1: PRIMITIVE COLORS
// ============================================================

const primitives = {
  // Base
  dark_a0: '#323232',
  light_a0: '#bcbcbc',

  // Light-mode primary (blue)
  primary_light_a0: '#2b76d9',
  primary_light_a10: '#2b68be',
  primary_light_a20: '#295ba4',
  primary_light_a30: '#274e8b',
  primary_light_a40: '#244173',
  primary_light_a50: '#20355b',

  // Dark-mode primary (brighter blue)
  primary_dark_a0: '#0084ff',
  primary_dark_a10: '#4a91ff',
  primary_dark_a20: '#6b9dff',
  primary_dark_a30: '#85abff',
  primary_dark_a40: '#9cb8ff',
  primary_dark_a50: '#b2c6ff',

  // Light-mode surface (white / light grey)
  surface_light_a0: '#EEEEEE',
  surface_light_a10: '#f0f0f0',
  surface_light_a20: '#e1e1e1',
  surface_light_a30: '#d3d3d3',
  surface_light_a40: '#c5c5c5',
  surface_light_a50: '#b6b6b6',

  // Dark-mode surface (dark grey / near-black)
  surface_dark_a0: '#191919',
  surface_dark_a10: '#353739',
  surface_dark_a20: '#292b2f',
  surface_dark_a30: '#626366',
  surface_dark_a40: '#7a7b7e',
  surface_dark_a50: '#939496',

  // Light-mode tonal surface
  tonalSurface_light_a0: '#F9F9F9',
  tonalSurface_light_a10: '#696969',
  tonalSurface_light_a20: '#d4d6df',
  tonalSurface_light_a30: '#c7c9d1',
  tonalSurface_light_a40: '#bbbdc3',
  tonalSurface_light_a50: '#afb0b5',

  // Dark-mode tonal surface
  tonalSurface_dark_a0: '#2c2c2c',
  tonalSurface_dark_a10: '#717171',
  tonalSurface_dark_a20: '#505460',
  tonalSurface_dark_a30: '#666a75',
  tonalSurface_dark_a40: '#7e828a',
  tonalSurface_dark_a50: '#9799a0',

  // Status – Light
  success_light_a0: '#1b7f5c', success_light_a10: '#28be8a', success_light_a20: '#58dbad',
  warning_light_a0: '#b8871f', warning_light_a10: '#dfae44', warning_light_a20: '#ebca85',
  danger_light_a0: '#b13535',  danger_light_a10: '#d06262',  danger_light_a20: '#e29d9d',
  info_light_a0: '#1e56a3',    info_light_a10: '#347ada',    info_light_a20: '#74a4e6',

  // Status – Dark
  success_dark_a0: '#22946e', success_dark_a10: '#47d5a6', success_dark_a20: '#9ae8ce',
  warning_dark_a0: '#a87a2a', warning_dark_a10: '#d7ac61', warning_dark_a20: '#ecd7b2',
  danger_dark_a0: '#9c2121',  danger_dark_a10: '#d94a4a',  danger_dark_a20: '#eb9e9e',
  info_dark_a0: '#21498a',    info_dark_a10: '#4077d1',    info_dark_a20: '#92b2e5',
} as const;

// ============================================================
// LAYER 2: SEMANTIC TOKENS (use these in your components)
// ============================================================

export interface ThemeTokens {
  // [A] Backgrounds
  bgApp: string;
  bgPanel: string;
  bgHover: string;
  bgSubtle: string;

  // [B] Typography
  textPrimary: string;
  textSecondary: string;
  textDisabled: string;
  textOnPrimary: string;

  // [C] Buttons & Components
  btnPrimaryBg: string;
  btnPrimaryBgHover: string;
  btnPrimaryText: string;

  // [D] Borders
  borderSubtle: string;
  borderFocus: string;

  // [E] Status
  statusSuccess: string;
  statusError: string;
  statusWarning: string;
  statusInfo: string;

  // [F] Raw primitives forwarded (useful for shadows / gradients)
  primary: string;
  primaryLight: string;
}

export const lightTheme: ThemeTokens = {
  bgApp: primitives.surface_light_a0,
  bgPanel: primitives.tonalSurface_light_a0,
  bgHover: primitives.surface_light_a10,
  bgSubtle: primitives.tonalSurface_light_a20,

  textPrimary: primitives.dark_a0,
  textSecondary: primitives.tonalSurface_light_a50,
  textDisabled: primitives.surface_light_a50,
  textOnPrimary: primitives.light_a0,

  btnPrimaryBg: primitives.primary_light_a0,
  btnPrimaryBgHover: primitives.primary_light_a10,
  btnPrimaryText: primitives.light_a0,

  borderSubtle: primitives.surface_light_a20,
  borderFocus: primitives.primary_light_a0,

  statusSuccess: primitives.success_light_a10,
  statusError: primitives.danger_light_a10,
  statusWarning: primitives.warning_light_a10,
  statusInfo: primitives.info_light_a10,

  primary: primitives.primary_light_a0,
  primaryLight: primitives.primary_light_a20,
};

export const darkTheme: ThemeTokens = {
  bgApp: primitives.surface_dark_a0,
  bgPanel: primitives.tonalSurface_dark_a0,
  bgHover: primitives.surface_dark_a10,
  bgSubtle: primitives.tonalSurface_dark_a20,

  textPrimary: primitives.light_a0,
  textSecondary: primitives.tonalSurface_dark_a40,
  textDisabled: primitives.surface_dark_a50,
  textOnPrimary: primitives.light_a0,

  btnPrimaryBg: primitives.primary_dark_a0,
  btnPrimaryBgHover: primitives.primary_dark_a10,
  btnPrimaryText: primitives.light_a0,

  borderSubtle: primitives.surface_dark_a20,
  borderFocus: primitives.primary_dark_a0,

  statusSuccess: primitives.success_dark_a10,
  statusError: primitives.danger_dark_a10,
  statusWarning: primitives.warning_dark_a10,
  statusInfo: primitives.info_dark_a10,

  primary: primitives.primary_dark_a0,
  primaryLight: primitives.primary_dark_a20,
};

// ============================================================
// LAYER 3: TYPOGRAPHY SCALE
// ============================================================

export const typography = {
  fontFamily: {
    regular: undefined,   // uses device default (san-serif)
    mono: 'monospace',
  },
  fontSize: {
    xs: 10,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 22,
    '2xl': 28,
    '3xl': 36,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
  },
  lineHeight: {
    tight: 18,
    normal: 22,
    relaxed: 28,
  },
} as const;

// ============================================================
// LAYER 4: SPACING SCALE
// ============================================================

export const spacing = {
  '0': 0,
  '1': 4,
  '2': 8,
  '3': 12,
  '4': 16,
  '5': 20,
  '6': 24,
  '8': 32,
  '10': 40,
  '12': 48,
  '16': 64,
} as const;

// ============================================================
// LAYER 5: RADIUS SCALE
// ============================================================

export const radius = {
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;
