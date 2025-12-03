import React, { useEffect, useState } from 'react';
import { Alert, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator, Button, Card, Chip, Dialog, Divider, FAB, IconButton, Menu, Portal, SegmentedButtons, Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Notification, notificationsService, NotificationStats } from '../../src/services/notificationsService';

type FilterType = 'all' | 'unread' | 'critical' | 'threats';

export const Notifications = () => {
  const { colors } = useTheme();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [filter]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      let filterOptions = {};
      
      switch (filter) {
        case 'unread':
          filterOptions = { unreadOnly: true };
          break;
        case 'critical':
          filterOptions = { severity: 'critical' };
          break;
        case 'threats':
          filterOptions = { type: 'threat_detected' };
          break;
      }

      const [notifData, statsData] = await Promise.all([
        notificationsService.getNotifications(filterOptions),
        notificationsService.getStats(),
      ]);

      setNotifications(notifData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationsService.markAsRead(id);
      await loadData();
    } catch (error) {
      Alert.alert('Error', 'No se pudo marcar como leída');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const count = await notificationsService.markAllAsRead();
      Alert.alert('✓ Completado', `${count} notificaciones marcadas como leídas`);
      await loadData();
    } catch (error) {
      Alert.alert('Error', 'No se pudo completar la acción');
    }
  };

  const handleDelete = async (id: string) => {
    Alert.alert(
      'Eliminar Notificación',
      '¿Estás seguro de eliminar esta notificación?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await notificationsService.deleteNotification(id);
              await loadData();
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar');
            }
          },
        },
      ]
    );
  };

  const handleClearAll = async () => {
    Alert.alert(
      'Limpiar Todas las Notificaciones',
      '¿Estás seguro? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpiar Todo',
          style: 'destructive',
          onPress: async () => {
            try {
              const count = await notificationsService.clearAllNotifications();
              Alert.alert('✓ Completado', `${count} notificaciones eliminadas`);
              await loadData();
            } catch (error) {
              Alert.alert('Error', 'No se pudo completar');
            }
          },
        },
      ]
    );
  };

  const handleNotificationPress = async (notification: Notification) => {
    if (!notification.read) {
      await handleMarkAsRead(notification.id);
    }
    
    if (notification.relatedData || notification.actions) {
      setSelectedNotification(notification);
      setShowDetailsDialog(true);
    }
  };

  const handleAction = async (notificationId: string, actionId: string) => {
    try {
      await notificationsService.performAction(notificationId, actionId);
      Alert.alert('✓ Acción Completada', 'La acción se ejecutó correctamente');
      setShowDetailsDialog(false);
      await loadData();
    } catch (error) {
      Alert.alert('Error', 'No se pudo ejecutar la acción');
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#F44336';
      case 'high': return '#FF5722';
      case 'medium': return '#FF9800';
      case 'low': return '#4CAF50';
      default: return colors.primary;
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return 'alert-octagon';
      case 'high': return 'alert';
      case 'medium': return 'information';
      case 'low': return 'check-circle';
      default: return 'bell';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'threat_detected': return 'shield-alert';
      case 'blocked_contact': return 'account-cancel';
      case 'system_alert': return 'information';
      case 'tip': return 'lightbulb';
      case 'suspicious_activity': return 'eye-alert';
      default: return 'bell';
    }
  };

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Ahora';
    if (minutes < 60) return `Hace ${minutes} min`;
    if (hours < 24) return `Hace ${hours}h`;
    if (days === 1) return 'Ayer';
    if (days < 7) return `Hace ${days} días`;
    return date.toLocaleDateString('es-PE');
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.onSurface, marginTop: 12 }}>
          Cargando notificaciones...
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        }
      >
        {/* Estadísticas */}
        {stats && (
          <Card style={styles.statsCard} mode="elevated">
            <Card.Content>
              <View style={styles.statsHeader}>
                <View style={styles.statsTitle}>
                  <Icon name="chart-box" size={24} color={colors.primary} />
                  <Text variant="titleMedium" style={[styles.titleText, { color: colors.onSurface }]}>
                    Resumen de Notificaciones
                  </Text>
                </View>
                <Menu
                  visible={showSettingsMenu}
                  onDismiss={() => setShowSettingsMenu(false)}
                  anchor={
                    <IconButton
                      icon="dots-vertical"
                      onPress={() => setShowSettingsMenu(true)}
                    />
                  }
                >
                  <Menu.Item
                    leadingIcon="check-all"
                    onPress={() => {
                      setShowSettingsMenu(false);
                      handleMarkAllAsRead();
                    }}
                    title="Marcar todas como leídas"
                  />
                  <Menu.Item
                    leadingIcon="delete-sweep"
                    onPress={() => {
                      setShowSettingsMenu(false);
                      handleClearAll();
                    }}
                    title="Limpiar todas"
                  />
                  <Divider />
                  <Menu.Item
                    leadingIcon="cog"
                    onPress={() => {
                      setShowSettingsMenu(false);
                      Alert.alert('Configuración', 'Función en desarrollo');
                    }}
                    title="Configuración"
                  />
                </Menu>
              </View>

              <View style={styles.statsGrid}>
                <View style={styles.statBox}>
                  <Icon name="bell" size={28} color="#2196F3" />
                  <Text variant="headlineSmall" style={[styles.statValue, { color: '#2196F3' }]}>
                    {stats.total}
                  </Text>
                  <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
                    Total
                  </Text>
                </View>
                <View style={styles.statBox}>
                  <Icon name="bell-badge" size={28} color="#FF9800" />
                  <Text variant="headlineSmall" style={[styles.statValue, { color: '#FF9800' }]}>
                    {stats.unread}
                  </Text>
                  <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
                    Sin leer
                  </Text>
                </View>
                <View style={styles.statBox}>
                  <Icon name="shield-check" size={28} color="#4CAF50" />
                  <Text variant="headlineSmall" style={[styles.statValue, { color: '#4CAF50' }]}>
                    {stats.threatsPrevented}
                  </Text>
                  <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
                    Prevenidas
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Filtros */}
        <Card style={styles.filtersCard} mode="outlined">
          <Card.Content>
            <SegmentedButtons
              value={filter}
              onValueChange={(value) => setFilter(value as FilterType)}
              buttons={[
                { value: 'all', label: 'Todas', icon: 'all-inclusive' },
                { 
                  value: 'unread', 
                  label: 'Sin leer',
                  icon: 'bell-badge',
                  ...(stats && stats.unread > 0 && {
                    badge: stats.unread.toString()
                  })
                },
                { value: 'critical', label: 'Críticas', icon: 'alert-octagon' },
                { value: 'threats', label: 'Amenazas', icon: 'shield-alert' },
              ]}
              style={styles.segmentedButtons}
            />
          </Card.Content>
        </Card>

        {/* Lista de notificaciones */}
        {notifications.length === 0 ? (
          <Card style={styles.emptyCard} mode="outlined">
            <Card.Content style={styles.emptyContent}>
              <Icon name="bell-off" size={64} color={colors.onSurfaceVariant} />
              <Text variant="titleLarge" style={[styles.emptyTitle, { color: colors.onSurfaceVariant }]}>
                No hay notificaciones
              </Text>
              <Text style={{ color: colors.onSurfaceDisabled, textAlign: 'center' }}>
                {filter === 'all' 
                  ? 'Recibirás alertas sobre amenazas de phishing aquí'
                  : 'No hay notificaciones con este filtro'}
              </Text>
            </Card.Content>
          </Card>
        ) : (
          <View style={styles.notificationsList}>
            {notifications.map((notification, index) => (
              <TouchableOpacity
                key={notification.id}
                activeOpacity={0.7}
                onPress={() => handleNotificationPress(notification)}
              >
                <Card 
                  style={[
                    styles.notificationCard,
                    !notification.read && styles.unreadCard,
                    notification.severity === 'critical' && styles.criticalCard,
                  ]} 
                  mode="elevated"
                >
                  <Card.Content style={styles.notificationContent}>
                    <View style={styles.notificationHeader}>
                      <View style={styles.notificationIcon}>
                        <Icon 
                          name={getTypeIcon(notification.type)} 
                          size={28} 
                          color={getSeverityColor(notification.severity)} 
                        />
                        {!notification.read && (
                          <View style={[styles.unreadBadge, { backgroundColor: colors.primary }]} />
                        )}
                      </View>

                      <View style={styles.notificationBody}>
                        <View style={styles.notificationTitleRow}>
                          <Text 
                            variant="titleMedium" 
                            style={[
                              styles.notificationTitle, 
                              { color: colors.onSurface },
                              !notification.read && styles.boldText
                            ]}
                          >
                            {notification.title}
                          </Text>
                          {notification.actionRequired && (
                            <Chip
                              mode="flat"
                              style={[styles.actionChip, { backgroundColor: '#F44336' + '30' }]}
                              textStyle={{ color: '#F44336', fontSize: 10, fontWeight: 'bold' }}
                            >
                              ACCIÓN
                            </Chip>
                          )}
                        </View>

                        <Text 
                          variant="bodyMedium" 
                          style={[
                            styles.notificationMessage, 
                            { color: colors.onSurfaceVariant }
                          ]}
                          numberOfLines={2}
                        >
                          {notification.message}
                        </Text>

                        {notification.relatedData && (
                          <View style={styles.relatedInfo}>
                            {notification.relatedData.phoneNumber && (
                              <View style={styles.infoChip}>
                                <Icon name="phone" size={14} color={colors.onSurfaceDisabled} />
                                <Text style={[styles.infoText, { color: colors.onSurfaceDisabled }]}>
                                  {notification.relatedData.phoneNumber}
                                </Text>
                              </View>
                            )}
                            {notification.relatedData.riskScore && (
                              <View style={styles.infoChip}>
                                <Icon name="chart-line" size={14} color={colors.onSurfaceDisabled} />
                                <Text style={[styles.infoText, { color: colors.onSurfaceDisabled }]}>
                                  Riesgo: {notification.relatedData.riskScore}%
                                </Text>
                              </View>
                            )}
                          </View>
                        )}

                        <View style={styles.notificationFooter}>
                          <View style={styles.timeAndSeverity}>
                            <Icon name="clock-outline" size={14} color={colors.onSurfaceDisabled} />
                            <Text style={[styles.timeText, { color: colors.onSurfaceDisabled }]}>
                              {getRelativeTime(notification.timestamp)}
                            </Text>
                            <Chip
                              mode="flat"
                              icon={() => <Icon name={getSeverityIcon(notification.severity)} size={12} />}
                              style={[
                                styles.severityChip,
                                { backgroundColor: getSeverityColor(notification.severity) + '20' }
                              ]}
                              textStyle={{ 
                                color: getSeverityColor(notification.severity), 
                                fontSize: 10 
                              }}
                            >
                              {notification.severity.toUpperCase()}
                            </Chip>
                          </View>

                          <IconButton
                            icon="delete"
                            size={18}
                            onPress={() => handleDelete(notification.id)}
                            iconColor={colors.error}
                          />
                        </View>
                      </View>
                    </View>

                    {/* Acciones rápidas */}
                    {notification.actions && notification.actions.length > 0 && (
                      <View style={styles.quickActions}>
                        {notification.actions.slice(0, 2).map((action) => (
                          <Button
                            key={action.id}
                            mode={action.type === 'primary' ? 'contained' : 'outlined'}
                            onPress={() => handleAction(notification.id, action.id)}
                            style={styles.quickActionButton}
                            compact
                            buttonColor={action.type === 'danger' ? '#F44336' : undefined}
                          >
                            {action.label}
                          </Button>
                        ))}
                      </View>
                    )}
                  </Card.Content>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* FAB para simular nueva notificación (solo para testing) */}
      <FAB
        icon="bell-plus"
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={async () => {
          try {
            await notificationsService.simulateIncomingNotification();
            Alert.alert('✓ Simulación', 'Nueva notificación recibida');
            await loadData();
          } catch (error) {
            Alert.alert('Error', 'No se pudo simular');
          }
        }}
        label="Simular"
      />

      {/* Dialog de detalles */}
      <Portal>
        <Dialog 
          visible={showDetailsDialog} 
          onDismiss={() => setShowDetailsDialog(false)}
          style={styles.detailsDialog}
        >
          <Dialog.Title>Detalles de Notificación</Dialog.Title>
          <Dialog.ScrollArea>
            <ScrollView contentContainerStyle={styles.dialogContent}>
              {selectedNotification && (
                <>
                  <View style={styles.dialogHeader}>
                    <Icon 
                      name={getTypeIcon(selectedNotification.type)} 
                      size={32} 
                      color={getSeverityColor(selectedNotification.severity)} 
                    />
                    <Text variant="titleLarge" style={{ color: colors.onSurface, flex: 1, marginLeft: 12 }}>
                      {selectedNotification.title}
                    </Text>
                  </View>

                  <Text variant="bodyLarge" style={{ color: colors.onSurfaceVariant, marginBottom: 16 }}>
                    {selectedNotification.message}
                  </Text>

                  {selectedNotification.relatedData && (
                    <View style={styles.relatedDataSection}>
                      <Text variant="titleMedium" style={{ color: colors.onSurface, marginBottom: 8 }}>
                        Información Adicional
                      </Text>
                      
                      {selectedNotification.relatedData.phoneNumber && (
                        <View style={styles.detailRow}>
                          <Icon name="phone" size={20} color={colors.onSurfaceVariant} />
                          <View style={{ flex: 1 }}>
                            <Text style={{ color: colors.onSurfaceDisabled, fontSize: 12 }}>
                              Número
                            </Text>
                            <Text style={{ color: colors.onSurface }}>
                              {selectedNotification.relatedData.phoneNumber}
                            </Text>
                          </View>
                        </View>
                      )}

                      {selectedNotification.relatedData.threatType && (
                        <View style={styles.detailRow}>
                          <Icon name="alert-circle" size={20} color={colors.onSurfaceVariant} />
                          <View style={{ flex: 1 }}>
                            <Text style={{ color: colors.onSurfaceDisabled, fontSize: 12 }}>
                              Tipo de Amenaza
                            </Text>
                            <Text style={{ color: colors.onSurface }}>
                              {selectedNotification.relatedData.threatType}
                            </Text>
                          </View>
                        </View>
                      )}

                      {selectedNotification.relatedData.riskScore && (
                        <View style={styles.detailRow}>
                          <Icon name="chart-line" size={20} color={colors.onSurfaceVariant} />
                          <View style={{ flex: 1 }}>
                            <Text style={{ color: colors.onSurfaceDisabled, fontSize: 12 }}>
                              Nivel de Riesgo
                            </Text>
                            <Text style={{ color: getSeverityColor(selectedNotification.severity), fontWeight: 'bold' }}>
                              {selectedNotification.relatedData.riskScore}% - {selectedNotification.severity.toUpperCase()}
                            </Text>
                          </View>
                        </View>
                      )}

                      {selectedNotification.relatedData.messagePreview && (
                        <View style={styles.detailRow}>
                          <Icon name="message-text" size={20} color={colors.onSurfaceVariant} />
                          <View style={{ flex: 1 }}>
                            <Text style={{ color: colors.onSurfaceDisabled, fontSize: 12 }}>
                              Vista Previa del Mensaje
                            </Text>
                            <Text style={{ color: colors.onSurface, fontStyle: 'italic' }}>
                              "{selectedNotification.relatedData.messagePreview}"
                            </Text>
                          </View>
                        </View>
                      )}
                    </View>
                  )}

                  <Text variant="bodySmall" style={{ color: colors.onSurfaceDisabled, marginTop: 16, textAlign: 'center' }}>
                    {selectedNotification.timestamp.toLocaleString('es-PE')}
                  </Text>
                </>
              )}
            </ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            {selectedNotification?.actions?.map((action) => (
              <Button
                key={action.id}
                onPress={() => handleAction(selectedNotification.id, action.id)}
                mode={action.type === 'primary' ? 'contained' : 'text'}
                buttonColor={action.type === 'danger' ? '#F44336' : undefined}
              >
                {action.label}
              </Button>
            ))}
            <Button onPress={() => setShowDetailsDialog(false)}>Cerrar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
    elevation: 3,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statsTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  titleText: {
    fontWeight: 'bold',
  },
  statsGrid: {
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
  filtersCard: {
    borderRadius: 16,
  },
  segmentedButtons: {
    marginVertical: 4,
  },
  emptyCard: {
    borderRadius: 16,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  emptyTitle: {
    fontWeight: 'bold',
  },
  notificationsList: {
    gap: 12,
  },
  notificationCard: {
    borderRadius: 12,
    elevation: 2,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  criticalCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  notificationContent: {
    paddingVertical: 12,
  },
  notificationHeader: {
    flexDirection: 'row',
    gap: 12,
  },
  notificationIcon: {
    position: 'relative',
  },
  unreadBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: 'white',
  },
  notificationBody: {
    flex: 1,
  },
  notificationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  notificationTitle: {
    flex: 1,
  },
  boldText: {
    fontWeight: 'bold',
  },
  actionChip: {
    height: 20,
    marginLeft: 8,
  },
  notificationMessage: {
    lineHeight: 20,
    marginBottom: 8,
  },
  relatedInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  infoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 12,
  },
  notificationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  timeAndSeverity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeText: {
    fontSize: 12,
  },
  severityChip: {
    height: 20,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  quickActionButton: {
    flex: 1,
    borderRadius: 8,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
  detailsDialog: {
    maxHeight: '80%',
  },
  dialogContent: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  dialogHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  relatedDataSection: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 8,
  },
});

export default Notifications;