import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

export const Simulations = () => {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text variant="titleLarge" style={{ color: colors.onSurface }}>
        Simulaciones Interactivas
      </Text>
      <Text style={{ color: colors.onSurface, marginTop: 8 }}>
        Practica detectando mensajes maliciosos con ejemplos interactivos.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default Simulations;