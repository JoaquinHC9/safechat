import axios from "axios";

export interface BlockedContact {
  id: string;
  numero: string;
  motivo: string;
  fecha: string;
  reportes: number;
  nivelRiesgo: "bajo" | "medio" | "alto";
}

export interface BlocklistStats {
  total: number;
  bloqueadosHoy: number;
  bloqueadosEstaSemana: number;
  nivelRiesgoPromedio: string;
}

const API_URL = "http://localhost:8080/api/blocklist"; 

export const blocklistService = {
  getBlockedContacts: () =>
    axios.get<BlockedContact[]>(`${API_URL}`),

  addBlockedContact: (data: Omit<BlockedContact, "id"|"reportes">) =>
    axios.post(`${API_URL}`, data),

  removeBlockedContact: (id: string) =>
    axios.delete(`${API_URL}/${id}`),

  getStats: () =>
    axios.get<BlocklistStats>(`${API_URL}/stats`),

  exportBlocklist: () =>
    axios.get(`${API_URL}/export`, { responseType: "blob" }),

  importBlocklist: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return axios.post(`${API_URL}/import`, formData);
  },
};