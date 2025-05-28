import { Link } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Snackbar, Text, TextInput, useTheme } from 'react-native-paper';
import { DatePickerModal } from 'react-native-paper-dates';
import { safeChatApi } from '../api/endpoints';

export default function RegisterScreen() {
  const { colors } = useTheme();
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState<Date | undefined>();
  const [telefono, setTelefono] = useState('');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [visible, setVisible] = useState(false); // Para el Snackbar

  const handleRegister = async () => {
    try {
      if (!fechaNacimiento) {
        Alert.alert('Error', 'Debes seleccionar una fecha de nacimiento');
        return;
      }

      const payload = {
        nombre,
        apellido,
        email,
        password,
        telefono,
        fechaNacimiento
      };

      const response = await safeChatApi.register(payload);
      setVisible(true); // Mostrar Snackbar
      console.log('Token recibido:', response.data.token);

    } catch (error: any) {
      console.error('Error en el registro', error);
      Alert.alert('Error', 'No se pudo registrar. Verifica tus datos.');
    }
  };

  const openDatePicker = () => {
    setIsDatePickerOpen(true);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.logoContainer}>
        <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
        <Text style={[styles.title, { color: colors.onSurface }]}>SafeChat</Text>
      </View>

      <TextInput
        label="Nombre"
        value={nombre}
        onChangeText={setNombre}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Apellido"
        value={apellido}
        onChangeText={setApellido}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Teléfono"
        value={telefono}
        onChangeText={setTelefono}
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

      <TouchableOpacity onPress={openDatePicker} activeOpacity={0.8}>
        <TextInput
          label="Fecha de nacimiento"
          value={fechaNacimiento ? fechaNacimiento.toLocaleDateString() : ''}
          editable={false}
          pointerEvents="none"
          right={<TextInput.Icon icon="calendar" />}
          mode="outlined"
          style={styles.input}
        />
      </TouchableOpacity>

      <DatePickerModal
        locale="es"
        mode="single"
        visible={isDatePickerOpen}
        onDismiss={() => setIsDatePickerOpen(false)}
        date={fechaNacimiento}
        onConfirm={({ date }) => {
          setIsDatePickerOpen(false);
          setFechaNacimiento(date);
        }}
        validRange={{ endDate: new Date() }}
        saveLabel="Seleccionar"
        label="Fecha de nacimiento"
        presentationStyle="pageSheet"
      />

      <Button mode="contained" onPress={handleRegister} style={styles.button}>
        Registrar
      </Button>
      <Link href="./login" style={styles.link}>
        <Text style={{ color: colors.primary }}>Volver al login</Text>
      </Link>

      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        duration={3000}
      >
        Registro exitoso
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, marginTop: 10 },
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
    borderRadius: 15, // ← corregido
  },
});
