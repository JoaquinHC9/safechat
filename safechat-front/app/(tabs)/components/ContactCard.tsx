import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card, Chip, IconButton, Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { BlockedContact } from '../../../src/services/blocklistService';

interface ContactCardProps {
  contact: BlockedContact;
  isExpanded: boolean;
  onToggleExpand: (id: string) => void;
  onRemove: (id: string, numero: string) => void;
}

const getRiskColor = (nivel: string, primaryColor: string) => {
  switch (nivel) {
    case 'alto': return '#F44336';
    case 'medio': return '#FF9800';
    case 'bajo': return '#FFC107';
    default: return primaryColor;
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

export const ContactCard: React.FC<ContactCardProps> = ({
  contact,
  isExpanded,
  onToggleExpand,
  onRemove,
}) => {
  const { colors } = useTheme();
  const riskColor = getRiskColor(contact.nivelRiesgo, colors.primary);

  return (
    <Card style={[styles.contactCard, { backgroundColor: colors.surface }]} mode="outlined">
      <Card.Content style={styles.contactContent}>
        {/* HEADER: área clickeable para expandir */}
        <View style={styles.contactHeader}>
          <TouchableOpacity
            onPress={() => onToggleExpand(contact.id)}
            style={{ flex: 1 }}
            activeOpacity={0.7}
          >
            <View style={styles.contactInfo}>
              <View style={styles.contactTitleRow}>
                <Icon name="phone" size={20} color={colors.primary} />
                <Text
                  variant="titleMedium"
                  style={{ color: colors.onSurface, fontWeight: 'bold', marginLeft: 8 }}
                >
                  {contact.numero}
                </Text>
              </View>
              <Text
                variant="bodyMedium"
                style={{ color: colors.onSurfaceVariant, marginTop: 4, marginLeft: 28 }}
                numberOfLines={2}
              >
                {contact.motivo}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Botón X */}
          <IconButton
            icon="close-circle"
            iconColor="#F44336"
            size={24}
            onPress={() => onRemove(contact.id, contact.numero)}
            style={styles.removeButton}
          />
        </View>

        {/* Footer y chips */}
        <View style={styles.contactFooter}>
          <View style={styles.badges}>
            <Chip
              mode="flat"
              icon={() => (
                <Icon
                  name={getRiskIcon(contact.nivelRiesgo)}
                  size={14}
                  color={riskColor}
                />
              )}
              style={[styles.riskChip, { backgroundColor: riskColor + '20' }]}
              textStyle={{ color: riskColor, fontSize: 11, fontWeight: '500' }}
            >
              {contact.nivelRiesgo}
            </Chip>

            <Chip
              mode="flat"
              icon="flag"
              style={[styles.reportsChip, { backgroundColor: colors.primaryContainer }]}
              textStyle={{ fontSize: 11, fontWeight: '500' }}
            >
              {contact.reportes} reporte{contact.reportes !== 1 ? 's' : ''}
            </Chip>
          </View>

          <Text variant="bodySmall" style={{ color: colors.onSurfaceDisabled }}>
            {new Date(contact.fecha).toLocaleDateString('es-PE', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </Text>
        </View>

        {/* Contenido expandido */}
        {isExpanded && (
          <View style={[styles.expandedContent, { borderTopColor: colors.outline }]}>
            <View style={styles.detailRow}>
              <Text
                style={{ color: colors.onSurfaceVariant, fontWeight: '600', fontSize: 12 }}
              >
                ID:
              </Text>
              <Text
                style={{ color: colors.onSurface, fontFamily: 'monospace', fontSize: 11 }}
              >
                {contact.id}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text
                style={{ color: colors.onSurfaceVariant, fontWeight: '600', fontSize: 12 }}
              >
                Bloqueado:
              </Text>
              <Text style={{ color: colors.onSurface, fontSize: 11 }}>
                {new Date(contact.fecha).toLocaleString('es-PE')}
              </Text>
            </View>
          </View>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  contactCard: {
    marginBottom: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  contactContent: {
    paddingVertical: 12,
    paddingHorizontal: 12,
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
  },
  contactFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  badges: {
    flexDirection: 'row',
    gap: 6,
  },
  riskChip: {
    height: 26,
  },
  reportsChip: {
    height: 26,
  },
  expandedContent: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  removeButton: {
    margin: 0,
  },
});
