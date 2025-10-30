import React, { useEffect, useState } from 'react';
import { Alert, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator, Avatar, Button, Card, Chip, Dialog, Divider, List, Portal, ProgressBar, Switch, Text, TextInput, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Achievement, ActivityLog, profileService, ProfileStats, SecuritySettings, UserProfile } from '../services/profileService';

export const Profile = () => {
  const { colors } = useTheme();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [settings, setSettings] = useState<SecuritySettings | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showBreachCheck, setShowBreachCheck] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedLastName, setEditedLastName] = useState('');
  const [breachResult, setBreachResult] = useState<{ breached: boolean; breaches: string[] } | null>(null);
  const [isCheckingBreaches, setIsCheckingBreaches] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [profileData, statsData, settingsData, achievementsData, activityData] = await Promise.all([
        profileService.getProfile(),
        profileService.getStats(),
        profileService.getSettings(),
        profileService.getAchievements(),
        profileService.getActivityLog(5),
      ]);

      setProfile(profileData);
      setStats(statsData);
      setSettings(settingsData);
      setAchievements(achievementsData);
      setActivityLog(activityData);
      setEditedName(profileData.nombre);
      setEditedLastName(profileData.apellido);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleEditProfile = async () => {
    if (!profile) return;
    try {
      await profileService.updateProfile({
        nombre: editedName,
        apellido: editedLastName,
      });
      await loadData();
      setShowEditDialog(false);
      Alert.alert('✓ Éxito', 'Perfil actualizado correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el perfil');
    }
  };

  const handleToggleSetting = async (key: keyof SecuritySettings) => {
    if (!settings) return;
    try {
      const newSettings = await profileService.updateSettings({
        [key]: !settings[key],
      });
      setSettings(newSettings);
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar la configuración');
    }
  };

  const handleCheckBreaches = async () => {
    if (!profile) return;
    setIsCheckingBreaches(true);
    try {
      const result = await profileService.checkBreaches(profile.email);
      setBreachResult(result);
      setShowBreachCheck(true);
    } catch (error) {
      Alert.alert('Error', 'No se pudo verificar las filtraciones');
    } finally {
      setIsCheckingBreaches(false);
    }
  };

  const handleExportData = async () => {
    Alert.alert(
      'Exportar Datos',
      '¿Deseas exportar todos tus datos? Recibirás un archivo JSON.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Exportar',
          onPress: async () => {
            try {
              const data = await profileService.exportData();
              Alert.alert('✓ Éxito', 'Datos exportados correctamente');
              console.log('Exported data:', data);
            } catch (error) {
              Alert.alert('Error', 'No se pudo exportar');
            }
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      '⚠️ Eliminar Cuenta',
      'Esta acción es permanente y no se puede deshacer. ¿Estás seguro?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            Alert.prompt(
              'Confirmar',
              'Ingresa tu contraseña para confirmar',
              async (password) => {
                try {
                  await profileService.deleteAccount(password || '');
                  Alert.alert('✓ Cuenta Eliminada', 'Tu cuenta ha sido eliminada');
                } catch (error: any) {
                  Alert.alert('Error', error.message);
                }
              },
              'secure-text'
            );
          },
        },
      ]
    );
  };

  const getAvatarInitials = () => {
    if (!profile) return '??';
    return `${profile.nombre.charAt(0)}${profile.apellido.charAt(0)}`.toUpperCase();
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'seguridad': return '#F44336';
      case 'aprendizaje': return '#2196F3';
      case 'comunidad': return '#4CAF50';
      case 'experto': return '#FF9800';
      default: return colors.primary;
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.onSurface, marginTop: 12 }}>
          Cargando perfil...
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
        {/* Header Card */}
        {profile && (
          <Card style={styles.headerCard} mode="elevated">
            <Card.Content style={styles.headerContent}>
              <TouchableOpacity style={styles.avatarContainer}>
                {profile.avatar ? (
                  <Avatar.Image size={100} source={{ uri: profile.avatar }} />
                ) : (
                  <Avatar.Text 
                    size={100} 
                    label={getAvatarInitials()} 
                    style={{ backgroundColor: colors.primary }}
                  />
                )}
                <View style={[styles.editAvatarBadge, { backgroundColor: colors.primary }]}>
                  <Icon name="camera" size={16} color="white" />
                </View>
              </TouchableOpacity>

              <Text variant="headlineSmall" style={[styles.profileName, { color: colors.onSurface }]}>
                {profile.nombre} {profile.apellido}
              </Text>

              <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant }}>
                {profile.email}
              </Text>

              <View style={styles.profileActions}>
                <Button
                  mode="contained"
                  onPress={() => setShowEditDialog(true)}
                  style={styles.actionButton}
                  icon="pencil"
                  compact
                >
                  Editar
                </Button>
                <Button
                  mode="outlined"
                  onPress={() => setShowSettingsDialog(true)}
                  style={styles.actionButton}
                  icon="cog"
                  compact
                >
                  Configuración
                </Button>
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Stats Card */}
        {stats && (
          <Card style={styles.statsCard} mode="elevated">
            <Card.Content>
              <View style={styles.sectionHeader}>
                <Icon name="chart-box" size={24} color={colors.primary} />
                <Text variant="titleLarge" style={[styles.sectionTitle, { color: colors.onSurface }]}>
                  Estadísticas
                </Text>
              </View>

              <View style={styles.statsGrid}>
                <View style={styles.statBox}>
                  <Icon name="message-text" size={28} color="#2196F3" />
                  <Text variant="headlineMedium" style={[styles.statValue, { color: '#2196F3' }]}>
                    {stats.mensajesAnalizados}
                  </Text>
                  <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant, textAlign: 'center' }}>
                    Mensajes Analizados
                  </Text>
                </View>

                <View style={styles.statBox}>
                  <Icon name="shield-alert" size={28} color="#F44336" />
                  <Text variant="headlineMedium" style={[styles.statValue, { color: '#F44336' }]}>
                    {stats.amenazasDetectadas}
                  </Text>
                  <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant, textAlign: 'center' }}>
                    Amenazas Detectadas
                  </Text>
                </View>

                <View style={styles.statBox}>
                  <Icon name="account-cancel" size={28} color="#FF9800" />
                  <Text variant="headlineMedium" style={[styles.statValue, { color: '#FF9800' }]}>
                    {stats.contactosBloqueados}
                  </Text>
                  <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant, textAlign: 'center' }}>
                    Bloqueados
                  </Text>
                </View>
              </View>

              <Divider style={{ marginVertical: 16 }} />

              <View style={styles.levelSection}>
                <View style={styles.levelHeader}>
                  <View style={styles.levelInfo}>
                    <Text variant="titleMedium" style={{ color: colors.onSurface, fontWeight: 'bold' }}>
                      Nivel {stats.nivel}
                    </Text>
                    <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
                      {stats.experiencia} / {stats.siguienteNivel} XP
                    </Text>
                  </View>
                  <Chip
                    mode="flat"
                    icon="fire"
                    style={{ backgroundColor: '#FF9800' + '30' }}
                    textStyle={{ color: '#FF9800', fontWeight: 'bold' }}
                  >
                    Racha: {stats.racha} días
                  </Chip>
                </View>
                <ProgressBar
                  progress={stats.experiencia / stats.siguienteNivel}
                  color="#4CAF50"
                  style={styles.progressBar}
                />
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Achievements Card */}
        <Card style={styles.achievementsCard} mode="elevated">
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Icon name="trophy" size={24} color="#FFC107" />
              <Text variant="titleLarge" style={[styles.sectionTitle, { color: colors.onSurface }]}>
                Logros
              </Text>
            </View>

            <View style={styles.achievementsList}>
              {achievements.map((achievement) => (
                <View
                  key={achievement.id}
                  style={[
                    styles.achievementItem,
                    !achievement.desbloqueado && styles.achievementLocked,
                  ]}
                >
                  <View
                    style={[
                      styles.achievementIcon,
                      {
                        backgroundColor: achievement.desbloqueado
                          ? getCategoryColor(achievement.categoria) + '30'
                          : colors.surfaceVariant,
                      },
                    ]}
                  >
                    <Icon
                      name={achievement.icono}
                      size={32}
                      color={
                        achievement.desbloqueado
                          ? getCategoryColor(achievement.categoria)
                          : colors.onSurfaceDisabled
                      }
                    />
                  </View>
                  <View style={styles.achievementInfo}>
                    <Text
                      variant="titleSmall"
                      style={{
                        color: achievement.desbloqueado ? colors.onSurface : colors.onSurfaceDisabled,
                        fontWeight: 'bold',
                      }}
                    >
                      {achievement.titulo}
                    </Text>
                    <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
                      {achievement.descripcion}
                    </Text>
                    {!achievement.desbloqueado && achievement.progreso !== undefined && (
                      <ProgressBar
                        progress={achievement.progreso / 100}
                        color={colors.primary}
                        style={{ marginTop: 8, height: 4 }}
                      />
                    )}
                    {achievement.desbloqueado && achievement.fechaDesbloqueo && (
                      <Text variant="bodySmall" style={{ color: colors.onSurfaceDisabled, marginTop: 4 }}>
                        Desbloqueado: {achievement.fechaDesbloqueo.toLocaleDateString('es-PE')}
                      </Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Activity Log */}
        <Card style={styles.activityCard} mode="elevated">
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Icon name="history" size={24} color={colors.primary} />
              <Text variant="titleLarge" style={[styles.sectionTitle, { color: colors.onSurface }]}>
                Actividad Reciente
              </Text>
            </View>

            {activityLog.map((activity, index) => (
              <View key={activity.id}>
                <View style={styles.activityItem}>
                  <View style={[styles.activityIcon, { backgroundColor: activity.color + '30' }]}>
                    <Icon name={activity.icono} size={20} color={activity.color} />
                  </View>
                  <View style={styles.activityInfo}>
                    <Text variant="bodyMedium" style={{ color: colors.onSurface }}>
                      {activity.descripcion}
                    </Text>
                    <Text variant="bodySmall" style={{ color: colors.onSurfaceDisabled }}>
                      {activity.timestamp.toLocaleString('es-PE')}
                    </Text>
                  </View>
                </View>
                {index < activityLog.length - 1 && <Divider style={{ marginVertical: 12 }} />}
              </View>
            ))}
          </Card.Content>
        </Card>

        {/* Security Section */}
        <Card style={styles.securityCard} mode="elevated">
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Icon name="shield-lock" size={24} color="#4CAF50" />
              <Text variant="titleLarge" style={[styles.sectionTitle, { color: colors.onSurface }]}>
                Seguridad
              </Text>
            </View>

            <Button
              mode="outlined"
              onPress={handleCheckBreaches}
              style={styles.securityButton}
              icon="alert-circle"
              loading={isCheckingBreaches}
              disabled={isCheckingBreaches}
            >
              Verificar Filtraciones de Datos
            </Button>

            <Button
              mode="outlined"
              onPress={() => Alert.alert('Info', 'Funcionalidad en desarrollo')}
              style={styles.securityButton}
              icon="lock-reset"
            >
              Cambiar Contraseña
            </Button>

            <Button
              mode="outlined"
              onPress={handleExportData}
              style={styles.securityButton}
              icon="download"
            >
              Exportar Mis Datos
            </Button>

            <Button
              mode="text"
              onPress={handleDeleteAccount}
              style={styles.deleteButton}
              textColor="#F44336"
              icon="delete"
            >
              Eliminar Cuenta
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Edit Profile Dialog */}
      <Portal>
        <Dialog visible={showEditDialog} onDismiss={() => setShowEditDialog(false)}>
          <Dialog.Title>Editar Perfil</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Nombre"
              value={editedName}
              onChangeText={setEditedName}
              mode="outlined"
              style={styles.dialogInput}
            />
            <TextInput
              label="Apellido"
              value={editedLastName}
              onChangeText={setEditedLastName}
              mode="outlined"
              style={styles.dialogInput}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowEditDialog(false)}>Cancelar</Button>
            <Button onPress={handleEditProfile}>Guardar</Button>
          </Dialog.Actions>
        </Dialog>

        {/* Settings Dialog */}
        <Dialog visible={showSettingsDialog} onDismiss={() => setShowSettingsDialog(false)}>
          <Dialog.Title>Configuración de Seguridad</Dialog.Title>
          <Dialog.ScrollArea>
            <ScrollView>
              {settings && (
                <List.Section>
                  <List.Item
                    title="Autenticación de dos factores"
                    description="Seguridad adicional para tu cuenta"
                    left={(props) => <List.Icon {...props} icon="shield-lock" />}
                    right={() => (
                      <Switch
                        value={settings.autenticacionDosFactores}
                        onValueChange={() => handleToggleSetting('autenticacionDosFactores')}
                      />
                    )}
                  />
                  <Divider />
                  <List.Item
                    title="Notificaciones por email"
                    description="Recibir alertas por correo"
                    left={(props) => <List.Icon {...props} icon="email" />}
                    right={() => (
                      <Switch
                        value={settings.notificacionesEmail}
                        onValueChange={() => handleToggleSetting('notificacionesEmail')}
                      />
                    )}
                  />
                  <Divider />
                  <List.Item
                    title="Notificaciones push"
                    description="Alertas en tiempo real"
                    left={(props) => <List.Icon {...props} icon="bell" />}
                    right={() => (
                      <Switch
                        value={settings.notificacionesPush}
                        onValueChange={() => handleToggleSetting('notificacionesPush')}
                      />
                    )}
                  />
                  <Divider />
                  <List.Item
                    title="Análisis automático"
                    description="Escanear mensajes automáticamente"
                    left={(props) => <List.Icon {...props} icon="shield-search" />}
                    right={() => (
                      <Switch
                        value={settings.analisisAutomatico}
                        onValueChange={() => handleToggleSetting('analisisAutomatico')}
                      />
                    )}
                  />
                </List.Section>
              )}
            </ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button onPress={() => setShowSettingsDialog(false)}>Cerrar</Button>
          </Dialog.Actions>
        </Dialog>

        {/* Breach Check Result Dialog */}
        <Dialog visible={showBreachCheck} onDismiss={() => setShowBreachCheck(false)}>
          <Dialog.Title>
            {breachResult?.breached ? '⚠️ Filtración Detectada' : '✓ Sin Filtraciones'}
          </Dialog.Title>
          <Dialog.Content>
            {breachResult?.breached ? (
              <>
                <Text variant="bodyMedium" style={{ marginBottom: 12 }}>
                  Tu email ha aparecido en las siguientes filtraciones:
                </Text>
                {breachResult.breaches.map((breach, index) => (
                  <Chip key={index} mode="flat" style={{ marginBottom: 8 }} icon="alert">
                    {breach}
                  </Chip>
                ))}
                <Text variant="bodySmall" style={{ marginTop: 12, color: colors.error }}>
                  Recomendación: Cambia tu contraseña inmediatamente
                </Text>
              </>
            ) : (
              <Text variant="bodyMedium">
                ¡Buenas noticias! Tu email no ha sido encontrado en filtraciones conocidas.
              </Text>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowBreachCheck(false)}>Cerrar</Button>
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
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCard: {
    borderRadius: 20,
    elevation: 4,
  },
  headerContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  editAvatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  profileName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  actionButton: {
    borderRadius: 8,
  },
  statsCard: {
    borderRadius: 16,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statBox: {
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontWeight: 'bold',
    marginTop: 4,
  },
  levelSection: {
    gap: 12,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  levelInfo: {
    gap: 4,
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
  },
  achievementsCard: {
    borderRadius: 16,
    elevation: 2,
  },
  achievementsList: {
    gap: 16,
  },
  achievementItem: {
    flexDirection: 'row',
    gap: 12,
  },
  achievementLocked: {
    opacity: 0.6,
  },
  achievementIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  activityCard: {
    borderRadius: 16,
    elevation: 2,
  },
  activityItem: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityInfo: {
    flex: 1,
    gap: 4,
  },
  securityCard: {
    borderRadius: 16,
    elevation: 2,
  },
  securityButton: {
    marginTop: 12,
    borderRadius: 8,
  },
  deleteButton: {
    marginTop: 20,
  },
  dialogInput: {
    marginBottom: 12,
    backgroundColor: 'transparent',
  },
});

export default Profile;