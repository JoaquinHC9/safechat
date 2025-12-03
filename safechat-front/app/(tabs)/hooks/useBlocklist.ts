import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { BlockedContact, blocklistService, BlocklistStats } from '../../../src/services/blocklistService';

export const useBlocklist = () => {
  const [blockedContacts, setBlockedContacts] = useState<BlockedContact[]>([]);
  const [stats, setStats] = useState<BlocklistStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await AsyncStorage.getItem('userId');
      if (id) setUserId(id);
    };
    fetchUserId();
  }, []);

  const loadData = async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const [contacts, statistics] = await Promise.all([
        blocklistService.getBlockedContacts(Number(userId)),
        blocklistService.getStats(Number(userId)),
      ]);
      setBlockedContacts(contacts);
      setStats(statistics);
    } catch (error) {
      console.error('Error loading blocklist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) loadData();
  }, [userId]);

  const removeContact = async (id: string) => {
    try {
      console.log('Eliminando contacto:', id);
      await blocklistService.removeBlockedContact(id);
      await loadData();
      return true;
    } catch (error) {
      console.error('Error al desbloquear:', error);
      return false;
    }
  };

  const exportContacts = async () => {
    try {
      const csv = await blocklistService.exportBlocklist(Number(userId));
      console.log('CSV generado:', csv);
      return { success: true, message: `✓ ${blockedContacts.length} contactos exportados exitosamente` };
    } catch (error) {
      console.error('Error exportando:', error);
      return { success: false, message: 'No se pudo exportar la lista' };
    }
  };

  return {
    blockedContacts,
    stats,
    isLoading,
    userId,
    loadData,
    removeContact,
    exportContacts,
  };
};
