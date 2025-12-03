import React from 'react';
import type { MD3Theme } from 'react-native-paper';
import { MD3DarkTheme as DarkTheme, PaperProvider } from 'react-native-paper';

const fontConfig = {
  bodyLarge: {
    fontFamily: 'Manrope_400Regular',
    fontWeight: '400' as const,
    fontSize: 16,
    letterSpacing: 0.5,
    lineHeight: 24,
  },
  bodyMedium: {
    fontFamily: 'Manrope_400Regular',
    fontWeight: '400' as const,
    fontSize: 14,
    letterSpacing: 0.25,
    lineHeight: 20,
  },
  titleLarge: {
    fontFamily: 'Manrope_400Regular',
    fontWeight: '400' as const,
    fontSize: 22,
    letterSpacing: 0,
    lineHeight: 28,
  },
  labelLarge: {
    fontFamily: 'Manrope_400Regular',
    fontWeight: '500' as const,
    fontSize: 14,
    letterSpacing: 0.1,
    lineHeight: 20,
  },
};

export const customTheme: MD3Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#2194F2',    
    background: '#111111',
    surface: '#222222',
    onSurface: '#ffffff',
    onBackground: '#ffffff',
    error: '#ff6b6b',
  },
  fonts: {
    ...DarkTheme.fonts,
    ...fontConfig,
  },
};

// ThemeProvider que usarás en _layout.tsx
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <PaperProvider theme={customTheme}>{children}</PaperProvider>;
};

export default ThemeProvider;