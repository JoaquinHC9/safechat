// services/profileService.ts
interface UserProfile {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  fechaNacimiento: Date;
  avatar?: string;
  fechaRegistro: Date;
  ultimoAcceso: Date;
}

interface ProfileStats {
  mensajesAnalizados: number;
  amenazasDetectadas: number;
  contactosBloqueados: number;
  diasActivo: number;
  racha: number; // días consecutivos usando la app
  nivel: number;
  experiencia: number;
  siguienteNivel: number;
}

interface SecuritySettings {
  autenticacionDosFactores: boolean;
  notificacionesEmail: boolean;
  notificacionesPush: boolean;
  analisisAutomatico: boolean;
  compartirEstadisticas: boolean;
  modoPrivado: boolean;
}

interface Achievement {
  id: string;
  titulo: string;
  descripcion: string;
  icono: string;
  desbloqueado: boolean;
  fechaDesbloqueo?: Date;
  progreso?: number; // 0-100
  categoria: 'seguridad' | 'aprendizaje' | 'comunidad' | 'experto';
}

interface ActivityLog {
  id: string;
  tipo: 'analisis' | 'bloqueo' | 'reporte' | 'configuracion';
  descripcion: string;
  timestamp: Date;
  icono: string;
  color: string;
}

class ProfileService {
  private currentUser: UserProfile = {
    id: '1',
    nombre: 'Juan Carlos',
    apellido: 'Pérez Silva',
    email: 'juan.perez@email.com',
    telefono: '+51 987 654 321',
    fechaNacimiento: new Date('1995-06-15'),
    avatar: undefined, // En producción sería una URL
    fechaRegistro: new Date('2024-01-15'),
    ultimoAcceso: new Date(),
  };

  private stats: ProfileStats = {
    mensajesAnalizados: 247,
    amenazasDetectadas: 18,
    contactosBloqueados: 12,
    diasActivo: 95,
    racha: 7,
    nivel: 8,
    experiencia: 2340,
    siguienteNivel: 3000,
  };

  private settings: SecuritySettings = {
    autenticacionDosFactores: true,
    notificacionesEmail: true,
    notificacionesPush: true,
    analisisAutomatico: true,
    compartirEstadisticas: false,
    modoPrivado: false,
  };

  private achievements: Achievement[] = [
    {
      id: '1',
      titulo: 'Primera Detección',
      descripcion: 'Detectaste tu primer intento de phishing',
      icono: 'shield-check',
      desbloqueado: true,
      fechaDesbloqueo: new Date('2024-01-20'),
      categoria: 'seguridad',
    },
    {
      id: '2',
      titulo: 'Guardián Activo',
      descripcion: 'Usa la app durante 7 días consecutivos',
      icono: 'fire',
      desbloqueado: true,
      fechaDesbloqueo: new Date('2024-02-01'),
      categoria: 'aprendizaje',
    },
    {
      id: '3',
      titulo: 'Detective Experto',
      descripcion: 'Detecta 10 amenazas correctamente',
      icono: 'shield-star',
      desbloqueado: true,
      fechaDesbloqueo: new Date('2024-03-15'),
      categoria: 'experto',
    },
    {
      id: '4',
      titulo: 'Protector Comunitario',
      descripcion: 'Reporta 5 amenazas a la comunidad',
      icono: 'account-group',
      desbloqueado: true,
      fechaDesbloqueo: new Date('2024-04-10'),
      categoria: 'comunidad',
    },
    {
      id: '5',
      titulo: 'Maestro de la Seguridad',
      descripcion: 'Completa 50 simulaciones con éxito',
      icono: 'school',
      desbloqueado: false,
      progreso: 68,
      categoria: 'aprendizaje',
    },
    {
      id: '6',
      titulo: 'Fortaleza Impenetrable',
      descripcion: 'Bloquea 20 contactos maliciosos',
      icono: 'castle',
      desbloqueado: false,
      progreso: 60,
      categoria: 'seguridad',
    },
  ];

  private activityLog: ActivityLog[] = [
    {
      id: '1',
      tipo: 'analisis',
      descripcion: 'Analizaste un mensaje sospechoso',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      icono: 'shield-search',
      color: '#2196F3',
    },
    {
      id: '2',
      tipo: 'bloqueo',
      descripcion: 'Bloqueaste a +51 999 888 777',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      icono: 'account-cancel',
      color: '#F44336',
    },
    {
      id: '3',
      tipo: 'reporte',
      descripcion: 'Reportaste una amenaza de phishing',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      icono: 'flag',
      color: '#FF9800',
    },
    {
      id: '4',
      tipo: 'configuracion',
      descripcion: 'Activaste autenticación de dos factores',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      icono: 'shield-lock',
      color: '#4CAF50',
    },
  ];

  async getProfile(): Promise<UserProfile> {
    await this.delay(300);
    return { ...this.currentUser };
  }

  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    await this.delay(500);
    this.currentUser = { ...this.currentUser, ...updates };
    return { ...this.currentUser };
  }

  async getStats(): Promise<ProfileStats> {
    await this.delay(200);
    return { ...this.stats };
  }

  async getSettings(): Promise<SecuritySettings> {
    await this.delay(200);
    return { ...this.settings };
  }

  async updateSettings(updates: Partial<SecuritySettings>): Promise<SecuritySettings> {
    await this.delay(400);
    this.settings = { ...this.settings, ...updates };
    return { ...this.settings };
  }

  async getAchievements(): Promise<Achievement[]> {
    await this.delay(300);
    return [...this.achievements];
  }

  async getActivityLog(limit: number = 10): Promise<ActivityLog[]> {
    await this.delay(300);
    return this.activityLog.slice(0, limit);
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<boolean> {
    await this.delay(600);
    // Simulación - en producción verificarías con el backend
    if (oldPassword.length < 6 || newPassword.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }
    return true;
  }

  async deleteAccount(password: string): Promise<boolean> {
    await this.delay(800);
    // Simulación - en producción verificarías y eliminarías
    if (password.length < 6) {
      throw new Error('Contraseña incorrecta');
    }
    return true;
  }

  async exportData(): Promise<string> {
    await this.delay(1000);
    // Simulación de exportación de datos (GDPR compliance)
    const data = {
      perfil: this.currentUser,
      estadisticas: this.stats,
      configuracion: this.settings,
      logros: this.achievements,
      actividad: this.activityLog,
    };
    return JSON.stringify(data, null, 2);
  }

  async checkBreaches(email: string): Promise<{ breached: boolean; breaches: string[] }> {
    await this.delay(800);
    // Simulación de integración con Have I Been Pwned
    const mockBreaches = Math.random() > 0.7 ? ['LinkedIn 2021', 'Adobe 2013'] : [];
    return {
      breached: mockBreaches.length > 0,
      breaches: mockBreaches,
    };
  }

  async updateAvatar(imageUri: string): Promise<string> {
    await this.delay(600);
    this.currentUser.avatar = imageUri;
    return imageUri;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const profileService = new ProfileService();
export type { Achievement, ActivityLog, ProfileStats, SecuritySettings, UserProfile };
