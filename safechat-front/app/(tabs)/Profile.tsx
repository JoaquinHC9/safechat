import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

export const Profile = () => {
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


const styles = StyleSheet.create({
  scene: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default Profile;