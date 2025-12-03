import { MD3DarkTheme as DarkTheme, configureFonts } from 'react-native-paper';

export const customTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#1e90ff',
    background: '#111111',
    surface: '#222222',
    text: '#ffffff',
    placeholder: '#999999',
    error: '#ff6b6b',
  },
  fonts: configureFonts({ config: {} }),
};

export default customTheme;