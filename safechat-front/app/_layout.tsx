import { Manrope_400Regular, useFonts } from '@expo-google-fonts/manrope';
import { Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { ThemeProvider } from '../components/theme/theme';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({ Manrope_400Regular });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </ThemeProvider>
  );
}
