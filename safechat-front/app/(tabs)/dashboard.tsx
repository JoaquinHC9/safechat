import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { BottomNavigation, Text, useTheme } from 'react-native-paper';

const HomeRoute = () => {
  const { colors } = useTheme();
  return (
    <View style={[styles.scene, { backgroundColor: colors.background }]}>
      <Text style={{ color: colors.onSurface, fontSize: 22, fontWeight: 'bold', marginBottom: 10 }}>
        Bienvenido a SafeChat!
      </Text>
      <Text style={{ color: colors.onSurface }}>
        Aquí podrás gestionar tus mensajes seguros y analizar correos con tranquilidad.
      </Text>
    </View>
  );
};

const ProfileRoute = () => {
  const { colors } = useTheme();
  return (
    <View style={[styles.scene, { backgroundColor: colors.background }]}>
      <Image
        source={require('../../assets/images/logo.png')}
        style={{ width: 120, height: 120, marginBottom: 20 }}
      />
      <Text style={{ color: colors.onSurface, fontSize: 18 }}>
        Perfil de usuario
      </Text>
    </View>
  );
};

export default function Dashboard() {
  const { colors } = useTheme();
  const router = useRouter();

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'home', title: 'Inicio', icon: 'home' },
    { key: 'profile', title: 'Perfil', icon: 'account' },
    { key: 'logout', title: 'Salir', icon: 'logout' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: HomeRoute,
    profile: ProfileRoute,
    logout: () => {
      // Logout logic: borrar token y redirigir a login
      AsyncStorage.removeItem('token').then(() => {
        router.replace('/login');
      });
      return null;
    },
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={(i) => setIndex(i)}
      renderScene={renderScene}
      barStyle={{ backgroundColor: colors.primary }}
      activeColor={colors.onPrimary}
      inactiveColor={colors.onSurface}
    />
  );
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});
