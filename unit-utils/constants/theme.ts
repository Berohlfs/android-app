import { Platform } from 'react-native';

const tintColorLight = '#000055';
const tintColorDark = '#6666CC';

export const Colors = {
  light: {
    text: '#11181C',
    textSecondary: '#687076',
    background: '#fff',
    surface: '#F4F4F5',
    surfaceActive: tintColorLight,
    surfaceActiveText: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    border: '#E4E4E7',
    inputBackground: '#F4F4F5',
    placeholder: '#9BA1A6',
  },
  dark: {
    text: '#ECEDEE',
    textSecondary: '#9BA1A6',
    background: '#151718',
    surface: '#1E2022',
    surfaceActive: '#000055',
    surfaceActiveText: '#fff',
    tint: tintColorDark,
    icon: '#9BA1A6',
    border: '#2E3234',
    inputBackground: '#1E2022',
    placeholder: '#687076',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
