import React, { useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { Button, Modal, Portal, TextInput, useTheme } from 'react-native-paper';
import type { NewBlockedContact } from '../../src/models/BlacklistData';
import { blocklistService } from '../../src/services/blocklistService';

interface AddBlockedModalProps {
  visible: boolean;
  onDismiss: () => void;
  onAdded: () => void;
  idUsuario: number; // id del usuario logueado
}

const AddBlockedModal = ({ visible, onDismiss, onAdded, idUsuario }: AddBlockedModalProps) => {
  const { colors } = useTheme();
  const [valor, setValor] = useState('');
  const [tipo, setTipo] = useState<'correo' | 'telefono'>('correo');
  const [motivo, setMotivo] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAdd = async () => {
    if (!valor || !motivo) {
      Alert.alert('Error', 'Completa todos los campos');
      return;
    }

    setIsLoading(true);
    try {
      const newContact: NewBlockedContact = {
        idUsuario,
        valor,
        tipo,
        motivo,
      };

      await blocklistService.addBlockedContact(newContact);
      Alert.alert('✓ Contacto agregado');
      onAdded();
      onDismiss();

      setValor('');
      setMotivo('');
      setTipo('correo');
    } catch (error) {
      Alert.alert('Error', 'No se pudo agregar el contacto');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={[styles.modal, { backgroundColor: colors.surface }]}
      >
        <TextInput
          label="Valor (email o teléfono)"
          value={valor}
          onChangeText={setValor}
          style={styles.input}
        />
        <TextInput
          label="Tipo (correo o teléfono)"
          value={tipo}
          onChangeText={(t) => setTipo(t as 'correo' | 'telefono')}
          style={styles.input}
        />
        <TextInput
          label="Motivo"
          value={motivo}
          onChangeText={setMotivo}
          style={styles.input}
        />
        <Button mode="contained" onPress={handleAdd} loading={isLoading} disabled={isLoading}>
          Agregar
        </Button>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  fab: { position: 'absolute', right: 16, bottom: 16 },
  modal: { padding: 20, margin: 20, borderRadius: 12 },
  input: { marginBottom: 16 },
});

export default AddBlockedModal;
