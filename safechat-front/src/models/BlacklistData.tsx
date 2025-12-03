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

export interface NewBlockedContact {
  idUsuario: number;
  valor: string;       // email o teléfono
  tipo: 'correo' | 'telefono';
  motivo: string;
}