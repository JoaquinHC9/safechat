import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { BottomNavigation } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Importa tus vistas
import { Analyze } from '../(tabs)/Analyze';
import { Blocklist } from '../(tabs)/BlockList';
import { HomeRoute } from '../(tabs)/Home';
import { Notifications } from '../(tabs)/Notifications';
import { Profile } from '../(tabs)/Profile';
import { Simulations } from '../(tabs)/Simulations';

export default function BottomNav() {
  const [index, setIndex] = useState(0);
  const router = useRouter();

  const [routes] = useState([
    { key: 'home', title: 'Inicio', icon: 'home' },
    { key: 'analyze', title: 'Analizar', icon: 'email-search-outline' },
    { key: 'blocklist', title: 'Bloqueados', icon: 'block-helper' },
    { key: 'notifications', title: 'Notificaciones', icon: 'bell-outline' },
    { key: 'simulations', title: 'Simulaciones', icon: 'gamepad-variant-outline' },
    { key: 'profile', title: 'Perfil', icon: 'account-circle-outline' },
    { key: 'logout', title: 'Salir', icon: 'logout' },
  ]);

  const renderIcon = (route: any, color: string) => (
    <MaterialCommunityIcons name={route.icon} size={24} color={color} />
  );

  const renderScene = BottomNavigation.SceneMap({
    home: HomeRoute,
    analyze: Analyze,
    blocklist: Blocklist,
    notifications: Notifications,
    simulations: Simulations,
    profile: Profile,
    logout: () => {
      AsyncStorage.removeItem('token').then(() => {
        router.replace('/login');
      });
      return null;
    },
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      renderIcon={({ route, color }) => renderIcon(route, color)}
    />
  );
}
