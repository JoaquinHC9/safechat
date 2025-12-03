import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  ActivityIndicator,
  Button,
  Card,
  FAB,
  Text,
  useTheme,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AddBlockedModal from './AddBlockedModal';
import { ContactCard } from './components/ContactCard';
import { ExportDialog } from './components/ExportDialog';
import { ImportDialog } from './components/ImportDialog';
import { RemoveDialog } from './components/RemoveDialog';
import { useBlocklist } from './hooks/useBlocklist';
import { useBlocklistDialogs } from './hooks/useBlocklistDialogs';

export const Blocklist = () => {
  const { colors } = useTheme();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Hooks personalizados
  const {
    blockedContacts,
    stats,
    isLoading,
    userId,
    loadData,
    removeContact,
    exportContacts,
  } = useBlocklist();

  const {
    removeDialog,
    openRemoveDialog,
    closeRemoveDialog,
    isRemoving,
    setIsRemoving,
    importDialog,
    openImportDialog,
    closeImportDialog,
    exportDialog,
    openExportDialog,
    closeExportDialog,
    isExporting,
    setIsExporting,
  } = useBlocklistDialogs();

  // Manejadores
  const handleRemove = (id: string, numero: string) => {
    console.log('handleRemove called with id:', id, 'numero:', numero);
    openRemoveDialog(id, numero);
  };

  const confirmRemove = async () => {
    if (!removeDialog.data) return;
    setIsRemoving(true);
    try {
      const success = await removeContact(removeDialog.data.id);
      closeRemoveDialog();
      if (success) {
        console.log('Contacto desbloqueado exitosamente');
      }
    } finally {
      setIsRemoving(false);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const result = await exportContacts();
      openExportDialog(result.message);
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.onSurface, marginTop: 12 }}>Cargando lista...</Text>
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
          <Card style={[styles.statsCard, { backgroundColor: colors.surface }]} mode="elevated">
            <Card.Content>
              <View style={styles.statsHeader}>
                <Icon name="chart-box" size={24} color={colors.primary} />
                <Text
                  variant="titleMedium"
                  style={[styles.statsTitle, { color: colors.onSurface }]}
                >
                  Estadísticas
                </Text>
              </View>
              <View style={styles.statsGrid}>
                <StatItem
                  label="Total bloqueados"
                  value={stats.total}
                  color={colors.primary}
                />
                <StatItem
                  label="Hoy"
                  value={stats.bloqueadosHoy}
                  color="#4CAF50"
                />
                <StatItem
                  label="Esta semana"
                  value={stats.bloqueadosEstaSemana}
                  color="#FF9800"
                />
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
            onPress={openImportDialog}
            style={styles.actionButton}
            icon="import"
          >
            Importar
          </Button>
        </View>

        {/* Lista de contactos bloqueados */}
        <Card style={[styles.listCard, { backgroundColor: colors.surface }]} mode="elevated">
          <Card.Content>
            <View style={styles.listHeader}>
              <Icon name="account-cancel" size={24} color={colors.primary} />
              <Text
                variant="titleLarge"
                style={[styles.listTitle, { color: colors.onSurface }]}
              >
                Contactos Bloqueados
              </Text>
            </View>

            {blockedContacts.length === 0 ? (
              <View style={styles.emptyState}>
                <Icon
                  name="shield-check"
                  size={64}
                  color={colors.onSurfaceVariant}
                />
                <Text
                  style={[styles.emptyText, { color: colors.onSurfaceVariant }]}
                >
                  No hay contactos bloqueados
                </Text>
                <Text
                  style={[
                    styles.emptySubtext,
                    { color: colors.onSurfaceDisabled },
                  ]}
                >
                  Los contactos que reportes aparecerán aquí
                </Text>
              </View>
            ) : (
              blockedContacts.map((contact) => (
                <ContactCard
                  key={contact.id}
                  contact={contact}
                  isExpanded={expandedId === contact.id}
                  onToggleExpand={() =>
                    setExpandedId(
                      expandedId === contact.id ? null : contact.id
                    )
                  }
                  onRemove={handleRemove}
                />
              ))
            )}
          </Card.Content>
        </Card>

        {/* Info adicional */}
        <Card style={[styles.infoCard, { backgroundColor: colors.surface }]} mode="outlined">
          <Card.Content>
            <View style={styles.infoHeader}>
              <Icon name="information" size={20} color={colors.primary} />
              <Text
                variant="bodyMedium"
                style={{ color: colors.onSurface, flex: 1, marginLeft: 12 }}
              >
                Los contactos bloqueados no podrán enviarte mensajes
              </Text>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Diálogos */}
      <RemoveDialog
        visible={removeDialog.visible}
        contactNumber={removeDialog.data?.numero}
        isRemoving={isRemoving}
        onConfirm={confirmRemove}
        onCancel={closeRemoveDialog}
      />

      <ImportDialog visible={importDialog.visible} onClose={closeImportDialog} />

      <ExportDialog
        visible={exportDialog.visible}
        message={exportDialog.message}
        onClose={closeExportDialog}
      />

      {/* FAB */}
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => setModalVisible(true)}
        label="Agregar"
      />

      {/* Modal */}
      {userId && (
        <AddBlockedModal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          onAdded={loadData}
          idUsuario={Number(userId)}
        />
      )}
    </View>
  );
};

// Componente auxiliar para estadísticas
interface StatItemProps {
  label: string;
  value: number;
  color: string;
}

const StatItem: React.FC<StatItemProps> = ({ label, value, color }) => (
  <View style={styles.statItem}>
    <Text
      variant="headlineMedium"
      style={[styles.statNumber, { color }]}
    >
      {value}
    </Text>
    <Text variant="bodySmall" style={styles.statLabel}>
      {label}
    </Text>
  </View>
);

// ESTILOS
const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: { padding: 16, gap: 14, paddingBottom: 90 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  // Tarjetas
  statsCard: { borderRadius: 16, elevation: 2 },
  listCard: { borderRadius: 16, elevation: 2 },
  infoCard: { borderRadius: 12, borderWidth: 1 },

  // Estadísticas
  statsHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  statsTitle: { fontWeight: '700', fontSize: 16 },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center', gap: 4 },
  statNumber: { fontWeight: '700' },
  statLabel: { fontSize: 11, fontWeight: '500', textAlign: 'center' },

  // Acciones
  actionsRow: { flexDirection: 'row', gap: 12 },
  actionButton: { flex: 1, borderRadius: 12 },

  // Lista
  listHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12, 
    marginBottom: 16, 
    paddingBottom: 12, 
    borderBottomWidth: 1, 
    borderBottomColor: 'rgba(0,0,0,0.08)' 
  },
  listTitle: { fontWeight: '700', fontSize: 18 },

  // Estado vacío
  emptyState: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { fontSize: 16, fontWeight: '600', marginTop: 16 },
  emptySubtext: { marginTop: 8, textAlign: 'center', fontSize: 13 },

  // Info
  infoHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },

  // FAB
  fab: { position: 'absolute', right: 16, bottom: 16 },
});

export default Blocklist;