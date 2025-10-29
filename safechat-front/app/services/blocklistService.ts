// services/blocklistService.ts
interface BlockedContact {
  id: string;
  numero: string;
  motivo: string;
  fecha: string;
  reportes: number;
  nivelRiesgo: 'bajo' | 'medio' | 'alto';
}

interface BlocklistStats {
  total: number;
  bloqueadosHoy: number;
  bloqueadosEstaSemana: number;
  nivelRiesgoPromedio: string;
}

class BlocklistService {
  private blockedContacts: BlockedContact[] = [
    {
      id: '1',
      numero: '+51 999 999 999',
      motivo: 'Mensajes sospechosos repetidos',
      fecha: '2025-10-28',
      reportes: 3,
      nivelRiesgo: 'alto',
    },
    {
      id: '2',
      numero: '+53 999 999 999',
      motivo: 'Envía URLs maliciosas',
      fecha: '2025-10-27',
      reportes: 5,
      nivelRiesgo: 'alto',
    },
    {
      id: '3',
      numero: '+51 999 999 888',
      motivo: 'Caracteres especiales sospechosos',
      fecha: '2025-10-26',
      reportes: 2,
      nivelRiesgo: 'medio',
    },
    {
      id: '4',
      numero: '+51 888 888 888',
      motivo: 'Intento de phishing bancario',
      fecha: '2025-10-25',
      reportes: 7,
      nivelRiesgo: 'alto',
    },
    {
      id: '5',
      numero: '+51 777 777 777',
      motivo: 'Spam comercial agresivo',
      fecha: '2025-10-24',
      reportes: 1,
      nivelRiesgo: 'bajo',
    },
  ];

  async getBlockedContacts(): Promise<BlockedContact[]> {
    await this.delay(400);
    return [...this.blockedContacts].sort((a, b) => 
      new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
    );
  }

  async addBlockedContact(contact: Omit<BlockedContact, 'id' | 'reportes'>): Promise<BlockedContact> {
    await this.delay(300);
    const newContact: BlockedContact = {
      ...contact,
      id: Date.now().toString(),
      reportes: 1,
    };
    this.blockedContacts.unshift(newContact);
    return newContact;
  }

  async removeBlockedContact(id: string): Promise<boolean> {
    await this.delay(300);
    const index = this.blockedContacts.findIndex(c => c.id === id);
    if (index !== -1) {
      this.blockedContacts.splice(index, 1);
      return true;
    }
    return false;
  }

  async getStats(): Promise<BlocklistStats> {
    await this.delay(200);
    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    return {
      total: this.blockedContacts.length,
      bloqueadosHoy: this.blockedContacts.filter(c => c.fecha === today).length,
      bloqueadosEstaSemana: this.blockedContacts.filter(c => c.fecha >= weekAgo).length,
      nivelRiesgoPromedio: this.calculateAverageRisk(),
    };
  }

  async exportBlocklist(): Promise<string> {
    await this.delay(600);
    const csv = [
      'Número,Motivo,Fecha,Reportes,Nivel de Riesgo',
      ...this.blockedContacts.map(c => 
        `${c.numero},"${c.motivo}",${c.fecha},${c.reportes},${c.nivelRiesgo}`
      )
    ].join('\n');
    return csv;
  }

  async importBlocklist(csvData: string): Promise<{ success: number; errors: number }> {
    await this.delay(800);
    // Simulación de importación
    const lines = csvData.split('\n').slice(1); // Saltar header
    let success = 0;
    let errors = 0;

    for (const line of lines) {
      if (line.trim()) {
        success++;
      }
    }

    return { success, errors };
  }

  private calculateAverageRisk(): string {
    const riskValues = { bajo: 1, medio: 2, alto: 3 };
    const total = this.blockedContacts.reduce(
      (sum, c) => sum + riskValues[c.nivelRiesgo], 0
    );
    const avg = total / this.blockedContacts.length;
    
    if (avg < 1.5) return 'Bajo';
    if (avg < 2.5) return 'Medio';
    return 'Alto';
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const blocklistService = new BlocklistService();
export type { BlockedContact, BlocklistStats };
