// src/api/endpoints.ts
import { LoginData } from '../../src/models/LoginData';
import { RegisterData } from '../../src/models/RegisterData';
import { BlockedContact, BlocklistStats, NewBlockedContact } from '../../src/services/blocklistService';
import instance from './base';

export const safeChatApi = {
  // Auth
  login: (user: LoginData) =>
    instance.post('auth/login', user, { validateStatus: () => true }),
  register: (user: RegisterData) =>
    instance.post('auth/register', user),

  // Blocklist
  getBlockedContacts: async (idUsuario: number): Promise<BlockedContact[]> => {
    const res = await instance.get(`lista-negra/usuario/${idUsuario}`);

    return res.data.map((item: any) => ({
      id: String(item.idListaNegra),
      numero: item.valor,
      motivo: item.motivo,
      fecha: item.creadoEn,
      reportes: item.reputacion ?? 0,
      nivelRiesgo:
        item.reputacion >= 70 ? "alto" :
          item.reputacion >= 40 ? "medio" : "bajo"
    }));
  },
  addBlockedContact: (contact: NewBlockedContact): Promise<BlockedContact> =>
    instance.post('lista-negra/agregar', contact).then(res => res.data),
  removeBlockedContact: (id: string): Promise<boolean> =>
  instance.delete(`lista-negra/${id}`).then(res => res.status === 200),
  getBlocklistStats: (idUsuario: number): Promise<BlocklistStats> =>
    instance.get(`lista-negra/estadisticas/${idUsuario}`).then(res => res.data),
  exportBlocklist: (idUsuario:number): Promise<string> =>
    instance.get(`lista-negra/exportar/${idUsuario}`).then(res => res.data),
  importBlocklist: (csv: string): Promise<{ success: number; errors: number }> =>
    instance.post('lista-negra/importar', { csv }).then(res => res.data),
};

export default safeChatApi;