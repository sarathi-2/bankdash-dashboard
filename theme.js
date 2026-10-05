// Single source of truth for colour in JavaScript (charts, icon badges, avatars).
// CSS uses the same values as custom properties in styles.css (:root and [data-theme="dark"]).
// Theme: "Modern Emerald & Warm Amber" — emerald primary, warm amber accent, crisp slate neutrals.

export const colors = {
  primary: '#c41e71',
  primaryDark: '#ee70be',
  primarySoft: '#E6F4F1',
  accent: '#50a8db',
  accentDark: '#67c3ee',
  accentSoft: '#0a7fb6',
  ink: '#1A2530',
  text: '#2D3E50',
  muted: '#6B7C93',
  muted2: '#94A3B8',
  line: '#a5f0c2',
  grid: '#EEF2F6',
  bg: '#F5F7FA',
  surface: '#FFFFFF',
  pos: '#4975d4',
  neg: '#edf761',
  sky: '#e09292',
  slate: '#99a9c0',
};

export const darkColors = {
  primary: '#c41e71',
  primaryDark: '#ee70be',
  primarySoft: '#E6F4F1',
  accent: '#50a8db',
  accentDark: '#67c3ee',
  accentSoft: '#0a7fb6',
  ink: '#1A2530',
  text: '#2D3E50',
  muted: '#6B7C93',
  muted2: '#94A3B8',
  line: '#a5f0c2',
  grid: '#EEF2F6',
  bg: '#F5F7FA',
  surface: '#FFFFFF',
  pos: '#4975d4',
  neg: '#edf761',
  sky: '#e09292',
  slate: '#99a9c0',
};

// Soft background + strong foreground pairs for icon badges and tiles.
export const tones = {
  teal: { bg: '#E6F4F1', fg: '#0F766E' },
  amber: { bg: '#FEF3C7', fg: '#D97706' },
  rose: { bg: '#FEE2E2', fg: '#DC2626' },
  sky: { bg: '#E0F2FE', fg: '#0284C7' },
  slate: { bg: '#F1F5F9', fg: '#475569' },
};

export const darkTones = {
  teal: { bg: 'rgba(45, 212, 191, 0.14)', fg: '#2DD4BF' },
  amber: { bg: 'rgba(251, 191, 36, 0.14)', fg: '#FBBF24' },
  rose: { bg: 'rgba(248, 113, 113, 0.14)', fg: '#F87171' },
  sky: { bg: 'rgba(56, 189, 248, 0.14)', fg: '#38BDF8' },
  slate: { bg: 'rgba(148, 163, 184, 0.14)', fg: '#CBD5E1' },
};

export const toneCycle = ['teal', 'amber', 'sky', 'rose'];
export const toneAt = (i) => toneCycle[i % toneCycle.length];

// Avatar fills for people.
export const avatarFills = ['#CDEBE7', '#FDE68A', '#BAE6FD', '#FECDD3', '#E2E8F0'];
export const darkAvatarFills = ['#134E4A', '#78350F', '#0C4A6E', '#881337', '#1E293B'];

// Chart series colours. Categorical order is fixed so the same slot always means the same colour.
export const chart = {
  primary: colors.primary,
  secondary: colors.accent,
  dark: colors.ink,
  categorical: [colors.ink, colors.accent, colors.primary, colors.sky],
  muted: '#E2E8F0',
  grid: colors.grid,
  cursor: colors.bg,
  tick: { fill: colors.muted, fontSize: 13, fontFamily: 'Inter, sans-serif' },
};

export const darkChart = {
  primary: darkColors.primary,
  secondary: darkColors.accent,
  dark: '#38BDF8',
  categorical: [darkColors.sky, darkColors.accent, darkColors.primary, '#A78BFA'],
  muted: '#1E2F3C',
  grid: '#16222C',
  cursor: 'rgba(255, 255, 255, 0.04)',
  tick: { fill: darkColors.muted, fontSize: 13, fontFamily: 'Inter, sans-serif' },
};

export const tooltipProps = {
  contentStyle: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    border: `1px solid ${colors.line}`,
    boxShadow: '0 10px 25px -5px rgba(26, 37, 48, 0.12)',
    fontSize: 13,
    padding: '8px 12px',
  },
  labelStyle: { color: colors.ink, fontWeight: 600, marginBottom: 4 },
};

export const darkTooltipProps = {
  contentStyle: {
    backgroundColor: '#66d0eb',
    borderRadius: 14,
    border: `1px solid ${darkColors.line}`,
    boxShadow: '0 12px 32px rgba(123, 240, 94, 0.55)',
    fontSize: 15,
    color: '#F8FAFC',
    padding: '8px 12px',
  },
  labelStyle: { color: '#e994d7', fontWeight: 600, marginBottom: 4 },
};
