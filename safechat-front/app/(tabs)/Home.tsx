import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Card, Chip, Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { blocklistService, BlocklistStats } from '../services/blocklistService';
import { SecurityTip, tipsService } from '../services/tipsService';

export const HomeRoute = () => {
  const { colors } = useTheme();
  const [dailyTip, setDailyTip] = useState<SecurityTip | null>(null);
  const [stats, setStats] = useState<BlocklistStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [tip, statistics] = await Promise.all([
        tipsService.getDailyTip(),
        blocklistService.getStats(),
      ]);
      setDailyTip(tip);
      setStats(statistics);
    } catch (error) {
      console.error('Error loading home data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'prevention': return '#4CAF50';
      case 'detection': return '#FF9800';
      case 'response': return '#F44336';
      default: return colors.primary;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'prevention': return 'Prevención';
      case 'detection': return 'Detección';
      case 'response': return 'Respuesta';
      default: return category;
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.onSurface, marginTop: 12 }}>
          Cargando...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
      }
    >
      {/* Banner de bienvenida */}
      <Card style={styles.welcomeCard} mode="elevated">
        <Card.Content>
          <View style={styles.welcomeContent}>
            <View>
              <Text variant="headlineSmall" style={[styles.welcomeTitle, { color: colors.onSurface }]}>
                ¡Bienvenido a SafeChat!
              </Text>
              <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant, marginTop: 4 }}>
                Tu escudo contra el phishing
              </Text>
            </View>
            <Icon name="shield-check" size={48} color={colors.primary} />
          </View>
        </Card.Content>
      </Card>

      {/* Estadísticas rápidas */}
      {stats && (
        <Card style={styles.statsCard} mode="elevated">
          <Card.Content>
            <View style={styles.statsHeader}>
              <Icon name="chart-line" size={20} color={colors.primary} />
              <Text variant="titleMedium" style={[styles.sectionTitle, { color: colors.onSurface }]}>
                Resumen de Protección
              </Text>
            </View>
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Icon name="shield-account" size={28} color="#4CAF50" />
                <Text variant="headlineSmall" style={[styles.statValue, { color: '#4CAF50' }]}>
                  {stats.total}
                </Text>
                <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant, textAlign: 'center' }}>
                  Contactos{'\n'}bloqueados
                </Text>
              </View>
              <View style={styles.statBox}>
                <Icon name="calendar-today" size={28} color="#2196F3" />
                <Text variant="headlineSmall" style={[styles.statValue, { color: '#2196F3' }]}>
                  {stats.bloqueadosHoy}
                </Text>
                <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant, textAlign: 'center' }}>
                  Bloqueados{'\n'}hoy
                </Text>
              </View>
              <View style={styles.statBox}>
                <Icon name="alert-circle" size={28} color="#FF9800" />
                <Text variant="headlineSmall" style={[styles.statValue, { color: '#FF9800' }]}>
                  {stats.nivelRiesgoPromedio}
                </Text>
                <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant, textAlign: 'center' }}>
                  Riesgo{'\n'}promedio
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Consejo del día */}
      {dailyTip && (
        <Card style={styles.tipCard} mode="elevated">
          <Card.Content>
            <View style={styles.tipHeader}>
              <View style={styles.tipTitleRow}>
                <Icon name={dailyTip.icon} size={24} color={getCategoryColor(dailyTip.category)} />
                <Text variant="titleMedium" style={[styles.tipTitle, { color: colors.onSurface }]}>
                  Consejo del Día
                </Text>
              </View>
              <Chip
                mode="flat"
                style={[styles.categoryChip, { backgroundColor: getCategoryColor(dailyTip.category) + '30' }]}
                textStyle={{ color: getCategoryColor(dailyTip.category), fontSize: 11, fontWeight: 'bold' }}
              >
                {getCategoryLabel(dailyTip.category).toUpperCase()}
              </Chip>
            </View>
            
            <Text variant="titleMedium" style={[styles.tipMainTitle, { color: colors.onSurface }]}>
              {dailyTip.title}
            </Text>
            
            <Text variant="bodyMedium" style={[styles.tipDescription, { color: colors.onSurfaceVariant }]}>
              {dailyTip.description}
            </Text>

            <View style={styles.tipFooter}>
              <Icon name="lightbulb-on" size={16} color={colors.primary} />
              <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant, fontStyle: 'italic' }}>
                Actualizado diariamente
              </Text>
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Acciones rápidas */}
      <Card style={styles.actionsCard} mode="elevated">
        <Card.Content>
          <Text variant="titleMedium" style={[styles.sectionTitle, { color: colors.onSurface, marginBottom: 16 }]}>
            Acciones Rápidas
          </Text>
          <View style={styles.actionsGrid}>
            <Button
              mode="contained"
              icon="shield-search"
              onPress={() => {}}
              style={styles.actionButton}
              contentStyle={styles.actionButtonContent}
            >
              Analizar
            </Button>
            <Button
              mode="contained-tonal"
              icon="account-cancel"
              onPress={() => {}}
              style={styles.actionButton}
              contentStyle={styles.actionButtonContent}
            >
              Lista Negra
            </Button>
          </View>
          <View style={[styles.actionsGrid, { marginTop: 12 }]}>
            <Button
              mode="contained-tonal"
              icon="school"
              onPress={() => {}}
              style={styles.actionButton}
              contentStyle={styles.actionButtonContent}
            >
              Aprender
            </Button>
            <Button
              mode="contained-tonal"
              icon="bell-alert"
              onPress={() => {}}
              style={styles.actionButton}
              contentStyle={styles.actionButtonContent}
            >
              Alertas
            </Button>
          </View>
        </Card.Content>
      </Card>

      {/* Consejos de seguridad */}
      <Card style={styles.securityTipsCard} mode="outlined">
        <Card.Content>
          <View style={styles.securityHeader}>
            <Icon name="shield-star" size={22} color={colors.primary} />
            <Text variant="titleMedium" style={[styles.sectionTitle, { color: colors.onSurface }]}>
              Mantente Seguro
            </Text>
          </View>
          
          <View style={styles.tipsList}>
            <View style={styles.tipsItem}>
              <Icon name="check-circle" size={18} color="#4CAF50" />
              <Text style={[styles.tipsText, { color: colors.onSurface }]}>
                Nunca compartas contraseñas por mensaje
              </Text>
            </View>
            <View style={styles.tipsItem}>
              <Icon name="check-circle" size={18} color="#4CAF50" />
              <Text style={[styles.tipsText, { color: colors.onSurface }]}>
                Verifica siempre el remitente antes de responder
              </Text>
            </View>
            <View style={styles.tipsItem}>
              <Icon name="check-circle" size={18} color="#4CAF50" />
              <Text style={[styles.tipsText, { color: colors.onSurface }]}>
                Desconfía de mensajes con urgencia exagerada
              </Text>
            </View>
            <View style={styles.tipsItem}>
              <Icon name="check-circle" size={18} color="#4CAF50" />
              <Text style={[styles.tipsText, { color: colors.onSurface }]}>
                No hagas clic en enlaces de fuentes desconocidas
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Información adicional */}
      <Card style={styles.infoCard} mode="outlined">
        <Card.Content>
          <View style={styles.infoContent}>
            <Icon name="information-outline" size={20} color={colors.primary} />
            <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant, flex: 1 }}>
              Mantente protegido analizando mensajes sospechosos y reportando amenazas
            </Text>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeCard: {
    borderRadius: 20,
    elevation: 3,
  },
  welcomeContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeTitle: {
    fontWeight: 'bold',
  },
  statsCard: {
    borderRadius: 16,
    elevation: 2,
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontWeight: 'bold',
    marginTop: 4,
  },
  tipCard: {
    borderRadius: 16,
    elevation: 2,
  },
  tipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tipTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tipTitle: {
    fontWeight: 'bold',
  },
  categoryChip: {
    height: 24,
  },
  tipMainTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tipDescription: {
    lineHeight: 22,
  },
  tipFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  actionsCard: {
    borderRadius: 16,
    elevation: 2,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
  },
  actionButtonContent: {
    paddingVertical: 8,
  },
  securityTipsCard: {
    borderRadius: 16,
  },
  securityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  tipsList: {
    gap: 12,
  },
  tipsItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  tipsText: {
    flex: 1,
    lineHeight: 20,
  },
  infoCard: {
    borderRadius: 12,
  },
  infoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});

export default HomeRoute;