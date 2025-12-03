import React from 'react';
import { Button, Dialog, Text } from 'react-native-paper';

interface ImportDialogProps {
  visible: boolean;
  onClose: () => void;
}

export const ImportDialog: React.FC<ImportDialogProps> = ({ visible, onClose }) => (
  <Dialog visible={visible} onDismiss={onClose}>
    <Dialog.Title>Importar Lista</Dialog.Title>
    <Dialog.Content>
      <Text variant="bodyMedium">
        Esta función permite importar contactos bloqueados desde un archivo CSV.
      </Text>
      <Text
        variant="bodySmall"
        style={{ marginTop: 12, color: '#666' }}
      >
        Funcionalidad de importación en desarrollo
      </Text>
    </Dialog.Content>
    <Dialog.Actions>
      <Button onPress={onClose}>Cerrar</Button>
    </Dialog.Actions>
  </Dialog>
);
