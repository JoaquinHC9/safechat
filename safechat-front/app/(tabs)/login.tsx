import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Snackbar, Text, TextInput, useTheme } from 'react-native-paper';
import { safeChatApi } from '../api/endpoints';
import { LoginData } from '../models/LoginData';

export default function LoginScreen() {
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleLogin = async () => {
    const credentials: LoginData = {
      username: email,
      password,
    };

    try {
      const response = await safeChatApi.login(credentials);

      if (response.status === 200 && response.data.token) {
        await AsyncStorage.setItem('token', response.data.token);
        setSnackbarMessage('Inicio de sesión exitoso');
        setSnackbarVisible(true);
        // Aquí puedes navegar al dashboard, por ejemplo
        router.push('/dashboard');
      } else {
        setSnackbarMessage('Credenciales inválidas o error en el servidor');
        setSnackbarVisible(true);
      }
    } catch (error) {
      console.error(error);
      setSnackbarMessage('Ocurrió un error inesperado'+  error);
      setSnackbarVisible(true);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.logoContainer}>
        <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
        <Text style={[styles.title, { color: colors.onSurface }]}>SafeChat</Text>
        <Text style={[styles.italics, { color: colors.onSurface }]}>
          Tu lugar seguro para analizar mensajes y correos seguros.
        </Text>
      </View>
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        mode="outlined"
        style={styles.input}
      />
      <Button mode="contained" onPress={handleLogin} style={styles.button}>
        Ingresar
      </Button>
      <TouchableOpacity>
        <Text style={[styles.link, { color: colors.onSurface }]}>Olvidé mi contraseña</Text>
      </TouchableOpacity>
      <Link href="./register" style={styles.link}>
        <Text style={{ color: colors.onSurface }}>¿Aún no tienes cuenta? Regístrate</Text>
      </Link>

      {/* Snackbar visual */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: 'OK',
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 24 },
  italics: {
    fontSize: 16,
    fontStyle: 'italic',
    fontWeight: '300',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: { marginBottom: 12, backgroundColor: 'transparent' },
  button: { marginTop: 12 },
  link: { textAlign: 'center', marginTop: 12 },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginTop: 12,
    borderRadius: 15,
  },
});
