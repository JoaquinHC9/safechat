import { safeChatApi } from '../../app/api/endpoints';
import type { BlockedContact, BlocklistStats, NewBlockedContact } from '../models/BlacklistData';

class BlocklistService {
  async getBlockedContacts(userId: number): Promise<BlockedContact[]> {
    return safeChatApi.getBlockedContacts(userId);
  }

  async addBlockedContact(contact: NewBlockedContact): Promise<BlockedContact> {
    return safeChatApi.addBlockedContact(contact);
  }

  async removeBlockedContact(id: string): Promise<boolean> {
    return safeChatApi.removeBlockedContact(id);
  }

  async getStats(userId: number): Promise<BlocklistStats> {
    return safeChatApi.getBlocklistStats(userId);
  }

  async exportBlocklist(userId: number): Promise<string> {
    return safeChatApi.exportBlocklist(userId);
  }

  async importBlocklist(csvData: string): Promise<{ success: number; errors: number }> {
    return safeChatApi.importBlocklist(csvData);
  }
}

export const blocklistService = new BlocklistService();
export type { BlockedContact, BlocklistStats, NewBlockedContact };

