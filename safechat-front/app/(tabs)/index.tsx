import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';

export default function HomeScreen() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.primary }]}>Bienvenido</Text>
      <Link href="../login" asChild>
        <Button mode="contained" style={styles.button}>Iniciar sesión</Button>
      </Link>
      <Link href="../register" asChild>
        <Button mode="outlined" style={styles.button}>Registrarse</Button>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 32,
  },
  button: {
    marginVertical: 8,
  },
});
