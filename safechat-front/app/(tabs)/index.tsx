import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Animated, Image, StyleSheet, View } from 'react-native';
import { Button, Card, Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function IndexScreen() {
  const { colors } = useTheme();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Hero Section con animación */}
      <Animated.View 
        style={[
          styles.heroSection,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }
        ]}
      >
        <View style={styles.logoContainer}>
          <View style={[styles.logoCircle, { backgroundColor: colors.primary + '20' }]}>
            <Image 
              source={require('../../assets/images/logo.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </View>

        <Text variant="displaySmall" style={[styles.title, { color: colors.onSurface }]}>
          SafeChat
        </Text>
        
        <Text variant="titleMedium" style={[styles.tagline, { color: colors.onSurfaceVariant }]}>
          Tu escudo contra el phishing
        </Text>

        <Text variant="bodyMedium" style={[styles.description, { color: colors.onSurfaceDisabled }]}>
          Protege tus mensajes y correos con inteligencia artificial avanzada
        </Text>
      </Animated.View>

      {/* Features Cards */}
      <Animated.View 
        style={[
          styles.featuresContainer,
          { opacity: fadeAnim }
        ]}
      >
        <Card style={styles.featureCard} mode="outlined">
          <Card.Content style={styles.featureContent}>
            <View style={[styles.featureIcon, { backgroundColor: '#4CAF50' + '20' }]}>
              <Icon name="shield-check" size={32} color="#4CAF50" />
            </View>
            <Text variant="titleSmall" style={{ color: colors.onSurface, fontWeight: 'bold' }}>
              Análisis Inteligente
            </Text>
            <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant, textAlign: 'center' }}>
              IA que detecta amenazas en tiempo real
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.featureCard} mode="outlined">
          <Card.Content style={styles.featureContent}>
            <View style={[styles.featureIcon, { backgroundColor: '#2196F3' + '20' }]}>
              <Icon name="bell-alert" size={32} color="#2196F3" />
            </View>
            <Text variant="titleSmall" style={{ color: colors.onSurface, fontWeight: 'bold' }}>
              Alertas Instantáneas
            </Text>
            <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant, textAlign: 'center' }}>
              Notificaciones al detectar peligros
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.featureCard} mode="outlined">
          <Card.Content style={styles.featureContent}>
            <View style={[styles.featureIcon, { backgroundColor: '#FF9800' + '20' }]}>
              <Icon name="school" size={32} color="#FF9800" />
            </View>
            <Text variant="titleSmall" style={{ color: colors.onSurface, fontWeight: 'bold' }}>
              Aprende Jugando
            </Text>
            <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant, textAlign: 'center' }}>
              Simulaciones interactivas y tips
            </Text>
          </Card.Content>
        </Card>
      </Animated.View>

      {/* Action Buttons */}
      <Animated.View 
        style={[
          styles.actionsContainer,
          { opacity: fadeAnim }
        ]}
      >
        <Link href="../login" asChild>
          <Button 
            mode="contained" 
            style={styles.primaryButton}
            contentStyle={styles.buttonContent}
            icon="login"
          >
            Iniciar Sesión
          </Button>
        </Link>
        
        <Link href="../register" asChild>
          <Button 
            mode="outlined" 
            style={styles.secondaryButton}
            contentStyle={styles.buttonContent}
            icon="account-plus"
          >
            Crear Cuenta
          </Button>
        </Link>

        <View style={styles.securityNote}>
          <Icon name="lock" size={16} color={colors.onSurfaceDisabled} />
          <Text variant="bodySmall" style={{ color: colors.onSurfaceDisabled }}>
            Tus datos están protegidos y encriptados
          </Text>
        </View>
      </Animated.View>

      {/* Stats Preview */}
      <View style={styles.statsPreview}>
        <View style={styles.statItem}>
          <Text variant="headlineSmall" style={[styles.statNumber, { color: colors.primary }]}>
            10K+
          </Text>
          <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
            Usuarios
          </Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text variant="headlineSmall" style={[styles.statNumber, { color: colors.primary }]}>
            50K+
          </Text>
          <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
            Amenazas Bloqueadas
          </Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text variant="headlineSmall" style={[styles.statNumber, { color: colors.primary }]}>
            99.8%
          </Text>
          <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
            Precisión
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  logo: {
    width: 100,
    height: 100,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  tagline: {
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    gap: 12,
  },
  featureCard: {
    flex: 1,
    borderRadius: 16,
  },
  featureContent: {
    alignItems: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  featureIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  primaryButton: {
    borderRadius: 12,
    elevation: 2,
  },
  secondaryButton: {
    borderRadius: 12,
    borderWidth: 2,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 8,
  },
  statsPreview: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontWeight: 'bold',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
});