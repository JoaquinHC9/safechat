import React from 'react';
import { Button, Dialog, Text } from 'react-native-paper';

interface RemoveDialogProps {
  visible: boolean;
  contactNumber?: string;
  isRemoving: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const RemoveDialog: React.FC<RemoveDialogProps> = ({
  visible,
  contactNumber,
  isRemoving,
  onConfirm,
  onCancel,
}) => (
  <Dialog visible={visible} onDismiss={onCancel}>
    <Dialog.Title>Desbloquear Contacto</Dialog.Title>
    <Dialog.Content>
      <Text variant="bodyMedium">
        ¿Estás seguro de desbloquear {contactNumber}?
      </Text>
    </Dialog.Content>
    <Dialog.Actions>
      <Button onPress={onCancel} disabled={isRemoving}>
        Cancelar
      </Button>
      <Button
        onPress={onConfirm}
        disabled={isRemoving}
        mode="contained"
        textColor="#F44336"
      >
        {isRemoving ? 'Desbloqueando...' : 'Desbloquear'}
      </Button>
    </Dialog.Actions>
  </Dialog>
);
