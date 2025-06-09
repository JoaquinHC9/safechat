import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import BottomNav from '../utils/BottomNav';

// Asegúrate de tener este logo en tus assets
const logo = require('../../assets/images/logo.png'); // Ruta ajustable según tu estructura

export default function Dashboard() {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Top Banner */}
      <View style={[styles.banner, { backgroundColor: colors.surface }]}>
        <Text style={[styles.title, { color: colors.onSurface }]}>SafeChat</Text>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
      </View>

      {/* Navegación inferior */}
      <View style={{ flex: 1 }}>
        <BottomNav />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 10,
    elevation: 4,
    zIndex: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 12,
  },
});
