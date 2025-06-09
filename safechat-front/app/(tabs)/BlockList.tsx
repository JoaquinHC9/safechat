import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Text, useTheme } from 'react-native-paper';

const bloqueados = [
  { numero: '+51 999 999 999', motivo: 'Mensajes sospechosos', fecha: '05/01/25' },
  { numero: '+53 999 999 999', motivo: 'Envía URL extrañas', fecha: '05/01/25' },
  { numero: '+51 999 999 888', motivo: 'Caracteres especiales en el mensaje', fecha: '05/01/25' },
  { numero: '+51 999 999 999', motivo: 'Mensajes sospechosos', fecha: '05/01/25' },
];

export const Blocklist = () => {
  const { colors } = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Card style={styles.card}>
        <Card.Title title="Lista Negra" titleStyle={{ color: colors.onSurface }} />
        <Card.Content>
          <View style={styles.headerRow}>
            <Text style={[styles.headerText, { color: colors.onSurface }]}>Número</Text>
            <Text style={[styles.headerText, { color: colors.onSurface }]}>Motivo</Text>
            <Text style={[styles.headerText, { color: colors.onSurface }]}>Fecha</Text>
          </View>
          {bloqueados.map((item, index) => (
            <View key={index} style={styles.row}>
              <Text style={[styles.cellText, { color: colors.onSurface }]}>{item.numero}</Text>
              <Text style={[styles.cellText, { color: colors.onSurface, textAlign: 'center' }]}>{item.motivo}</Text>
              <Text style={[styles.cellText, { color: colors.onSurface, textAlign: 'right' }]}>{item.fecha}</Text>
            </View>
          ))}
          <Button
            mode="contained"
            style={styles.button}
            onPress={() => alert('Exportando bloqueos...')}
          >
            Exportar
          </Button>
          <Button
            mode="contained"
            style={[styles.button, { marginTop: 12 }]}
            onPress={() => alert('Importando bloqueos...')}
          >
            Importar
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    paddingBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  headerText: {
    flex: 1,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  cellText: {
    flex: 1,
    fontSize: 14,
  },
  button: {
    backgroundColor: '#2194F2',
    borderRadius: 20,
    marginTop: 20,
    alignSelf: 'center',
    width: '60%',
  },
});

export default Blocklist;
