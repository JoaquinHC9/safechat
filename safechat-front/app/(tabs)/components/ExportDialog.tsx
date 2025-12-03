import React from 'react';
import { Button, Dialog, Text } from 'react-native-paper';

interface ExportDialogProps {
  visible: boolean;
  message: string;
  onClose: () => void;
}

export const ExportDialog: React.FC<ExportDialogProps> = ({
  visible,
  message,
  onClose,
}) => (
  <Dialog visible={visible} onDismiss={onClose}>
    <Dialog.Title>Exportación</Dialog.Title>
    <Dialog.Content>
      <Text variant="bodyMedium">{message}</Text>
    </Dialog.Content>
    <Dialog.Actions>
      <Button onPress={onClose}>Cerrar</Button>
    </Dialog.Actions>
  </Dialog>
);
