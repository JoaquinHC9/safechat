import React, { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Button, Card, Text, useTheme } from 'react-native-paper';

export const Analyze = () => {
  const { colors } = useTheme();
  const [mensaje, setMensaje] = useState('');
  const [resultado, setResultado] = useState('');

  const handleAnalizar = () => {
    // Lógica simulada
    setResultado(
      'Estado: Sospechoso\n' +
      'Amenazas identificadas: Intento de phishing, Redireccionamiento malicioso\n' +
      'Acciones recomendadas: Evite responder mensajes de esta persona y al remitente'
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Card style={styles.card}>
        <Card.Title title="Ingresa Mensaje sospechoso" titleStyle={{ color: colors.onSurface }} />
        <Card.Content>
          <TextInput
            multiline
            numberOfLines={4}
            placeholder="Copia el mensaje aquí..."
            placeholderTextColor="#aaa"
            value={mensaje}
            onChangeText={setMensaje}
            style={[styles.textArea, { color: colors.onSurface, borderColor: colors.surface }]}
          />
          <Button
            mode="contained"
            onPress={handleAnalizar}
            style={styles.analizarButton}
            labelStyle={{ color: '#fff' }}
          >
            Analizar
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Resultados" titleStyle={{ color: colors.onSurface }} />
        <Card.Content>
          <Text style={{ color: colors.onSurface }}>{resultado || 'Resultados del análisis'}</Text>
          {resultado && (
            <Button
              mode="contained"
              buttonColor="#B22222"
              style={styles.reportarButton}
              onPress={() => alert('Mensaje reportado')}
            >
              Reportar
            </Button>
          )}
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    paddingBottom: 8,
  },
  textArea: {
    height: 120,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    textAlignVertical: 'top',
  },
  analizarButton: {
    backgroundColor: '#2194F2',
    borderRadius: 20,
    alignSelf: 'center',
    paddingHorizontal: 20,
  },
  reportarButton: {
    marginTop: 16,
    borderRadius: 20,
    alignSelf: 'center',
  },
});

export default Analyze;
