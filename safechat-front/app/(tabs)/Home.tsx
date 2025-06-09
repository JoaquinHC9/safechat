import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export const HomeRoute = () => {
  const { colors } = useTheme();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.primary }]}>
          Bienvenido a SafeChat
        </Text>

        <View style={styles.tipBox}>
          <Icon name="shield-check" size={24} color={colors.primary} />
          <Text style={[styles.tipText, { color: colors.onSurface }]}>
            Consejo de hoy: Nunca abras enlaces de remitentes desconocidos.
          </Text>
        </View>

        
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 10,
    marginBottom: 24,
  },
  tipText: {
    marginLeft: 10,
    fontSize: 14,
    flexShrink: 1,
  },
  buttonsContainer: {
    gap: 12,
  },
  button: {
    borderRadius: 8,
  },
  outlinedButton: {
    borderRadius: 8,
    borderWidth: 1,
  },
});

export default HomeRoute;
