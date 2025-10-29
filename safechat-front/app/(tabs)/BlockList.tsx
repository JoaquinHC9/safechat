import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Card, Chip, FAB, IconButton, Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { BlockedContact, blocklistService, BlocklistStats } from '../services/blocklistService';

export const Blocklist = () => {
  const { colors } = useTheme();
  const [blockedContacts, setBlockedContacts] = useState<BlockedContact[]>([]);
  const [stats, setStats] = useState<BlocklistStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [contacts, statistics] = await Promise.all([
        blocklistService.getBlockedContacts(),
        blocklistService.getStats(),
      ]);
      setBlockedContacts(contacts);
      setStats(statistics);
    } catch (error) {
      console.error('Error loading blocklist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (id: string, numero: string) => {
    Alert.alert(
      'Desbloquear Contacto',
      `¿Estás seguro de desbloquear ${numero}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Desbloquear',
          onPress: async () => {
            try {
              await blocklistService.removeBlockedContact(id);
              await loadData();
              Alert.alert('✓ Contacto desbloqueado');
            } catch (error) {
              Alert.alert('Error', 'No se pudo desbloquear el contacto');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const csv = await blocklistService.exportBlocklist();
      // En una app real, aquí guardarías o compartirías el archivo
      Alert.alert('✓ Exportación exitosa', `${blockedContacts.length} contactos exportados`);
      console.log('CSV generado:', csv);
    } catch (error) {
      Alert.alert('Error', 'No se pudo exportar la lista');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = () => {
    Alert.alert(
      'Importar Lista',
      'Esta función permite importar contactos bloqueados desde un archivo CSV',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Seleccionar archivo',
          onPress: () => Alert.alert('Info', 'Funcionalidad de importación en desarrollo'),
        },
      ]
    );
  };

  const getRiskColor = (nivel: string) => {
    switch (nivel) {
      case 'alto': return '#F44336';
      case 'medio': return '#FF9800';
      case 'bajo': return '#FFC107';
      default: return colors.primary;
    }
  };

  const getRiskIcon = (nivel: string) => {
    switch (nivel) {
      case 'alto': return 'alert-octagon';
      case 'medio': return 'alert';
      case 'bajo': return 'alert-circle-outline';
      default: return 'shield';
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.onSurface, marginTop: 12 }}>
          Cargando lista...
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Estadísticas */}
        {stats && (
          <Card style={styles.statsCard} mode="elevated">
            <Card.Content>
              <View style={styles.statsHeader}>
                <Icon name="chart-box" size={24} color={colors.primary} />
                <Text variant="titleMedium" style={[styles.statsTitle, { color: colors.onSurface }]}>
                  Estadísticas
                </Text>
              </View>
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Text variant="headlineMedium" style={[styles.statNumber, { color: colors.primary }]}>
                    {stats.total}
                  </Text>
                  <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
                    Total bloqueados
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Text variant="headlineMedium" style={[styles.statNumber, { color: '#4CAF50' }]}>
                    {stats.bloqueadosHoy}
                  </Text>
                  <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
                    Hoy
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Text variant="headlineMedium" style={[styles.statNumber, { color: '#FF9800' }]}>
                    {stats.bloqueadosEstaSemana}
                  </Text>
                  <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
                    Esta semana
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Acciones rápidas */}
        <View style={styles.actionsRow}>
          <Button
            mode="contained"
            onPress={handleExport}
            disabled={isExporting}
            style={styles.actionButton}
            icon="export"
          >
            {isExporting ? 'Exportando...' : 'Exportar'}
          </Button>
          <Button
            mode="outlined"
            onPress={handleImport}
            style={styles.actionButton}
            icon="import"
          >
            Importar
          </Button>
        </View>

        {/* Lista de contactos bloqueados */}
        <Card style={styles.listCard} mode="elevated">
          <Card.Content>
            <View style={styles.listHeader}>
              <Icon name="account-cancel" size={24} color={colors.primary} />
              <Text variant="titleLarge" style={[styles.listTitle, { color: colors.onSurface }]}>
                Contactos Bloqueados
              </Text>
            </View>

            {blockedContacts.length === 0 ? (
              <View style={styles.emptyState}>
                <Icon name="shield-check" size={64} color={colors.onSurfaceVariant} />
                <Text style={[styles.emptyText, { color: colors.onSurfaceVariant }]}>
                  No hay contactos bloqueados
                </Text>
                <Text style={[styles.emptySubtext, { color: colors.onSurfaceDisabled }]}>
                  Los contactos que reportes aparecerán aquí
                </Text>
              </View>
            ) : (
              blockedContacts.map((contact) => (
                <Card
                  key={contact.id}
                  style={styles.contactCard}
                  mode="outlined"
                  onPress={() => setExpandedId(expandedId === contact.id ? null : contact.id)}
                >
                  <Card.Content style={styles.contactContent}>
                    <View style={styles.contactHeader}>
                      <View style={styles.contactInfo}>
                        <View style={styles.contactTitleRow}>
                          <Icon name="phone" size={20} color={colors.primary} />
                          <Text variant="titleMedium" style={{ color: colors.onSurface, fontWeight: 'bold' }}>
                            {contact.numero}
                          </Text>
                        </View>
                        <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant, marginTop: 4 }}>
                          {contact.motivo}
                        </Text>
                      </View>
                      
                      <IconButton
                        icon="close-circle"
                        iconColor="#F44336"
                        size={24}
                        onPress={() => handleRemove(contact.id, contact.numero)}
                      />
                    </View>

                    <View style={styles.contactFooter}>
                      <View style={styles.badges}>
                        <Chip
                          mode="flat"
                          icon={() => <Icon name={getRiskIcon(contact.nivelRiesgo)} size={16} color={getRiskColor(contact.nivelRiesgo)} />}
                          style={[styles.riskChip, { backgroundColor: getRiskColor(contact.nivelRiesgo) + '20' }]}
                          textStyle={{ color: getRiskColor(contact.nivelRiesgo), fontSize: 12 }}
                        >
                          Riesgo {contact.nivelRiesgo}
                        </Chip>
                        
                        <Chip
                          mode="flat"
                          icon="flag"
                          style={styles.reportsChip}
                          textStyle={{ fontSize: 12 }}
                        >
                          {contact.reportes} reporte{contact.reportes !== 1 ? 's' : ''}
                        </Chip>
                      </View>

                      <Text variant="bodySmall" style={{ color: colors.onSurfaceDisabled }}>
                        {new Date(contact.fecha).toLocaleDateString('es-PE', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </Text>
                    </View>

                    {expandedId === contact.id && (
                      <View style={styles.expandedContent}>
                        <View style={styles.detailRow}>
                          <Text style={{ color: colors.onSurfaceVariant, fontWeight: 'bold' }}>
                            ID:
                          </Text>
                          <Text style={{ color: colors.onSurface, fontFamily: 'monospace' }}>
                            {contact.id}
                          </Text>
                        </View>
                        <View style={styles.detailRow}>
                          <Text style={{ color: colors.onSurfaceVariant, fontWeight: 'bold' }}>
                            Bloqueado:
                          </Text>
                          <Text style={{ color: colors.onSurface }}>
                            {new Date(contact.fecha).toLocaleString('es-PE')}
                          </Text>
                        </View>
                      </View>
                    )}
                  </Card.Content>
                </Card>
              ))
            )}
          </Card.Content>
        </Card>

        {/* Info adicional */}
        <Card style={styles.infoCard} mode="outlined">
          <Card.Content>
            <View style={styles.infoHeader}>
              <Icon name="information" size={20} color={colors.primary} />
              <Text variant="bodyMedium" style={{ color: colors.onSurface, flex: 1 }}>
                Los contactos bloqueados no podrán enviarte mensajes
              </Text>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* FAB para agregar manualmente */}
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => Alert.alert('Info', 'Funcionalidad de agregar manual en desarrollo')}
        label="Agregar"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    gap: 16,
    paddingBottom: 90,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsCard: {
    borderRadius: 16,
    elevation: 2,
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  statsTitle: {
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontWeight: 'bold',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
  },
  listCard: {
    borderRadius: 16,
    elevation: 2,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  listTitle: {
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  emptySubtext: {
    marginTop: 8,
    textAlign: 'center',
  },
  contactCard: {
    marginBottom: 12,
    borderRadius: 12,
  },
  contactContent: {
    paddingVertical: 12,
  },
  contactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  contactInfo: {
    flex: 1,
  },
  contactTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contactFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
  },
  riskChip: {
    height: 28,
  },
  reportsChip: {
    height: 28,
  },
  expandedContent: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoCard: {
    borderRadius: 12,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});

export default Blocklist;