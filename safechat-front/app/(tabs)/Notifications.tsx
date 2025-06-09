import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

export const Notifications = () => {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text variant="titleLarge" style={{ color: colors.onSurface }}>
        Notificaciones
      </Text>
      <Text style={{ color: colors.onSurface, marginTop: 8 }}>
        Aquí recibirás alertas sobre posibles ataques de phishing.
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

export default Notifications;