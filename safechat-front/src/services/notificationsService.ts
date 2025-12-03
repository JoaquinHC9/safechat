// services/notificationsService.ts
interface Notification {
  id: string;
  type: 'threat_detected' | 'blocked_contact' | 'system_alert' | 'tip' | 'suspicious_activity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionRequired: boolean;
  relatedData?: {
    phoneNumber?: string;
    messagePreview?: string;
    threatType?: string;
    riskScore?: number;
    blockedContactId?: string;
  };
  actions?: NotificationAction[];
}

interface NotificationAction {
  id: string;
  label: string;
  type: 'primary' | 'secondary' | 'danger';
  action: 'block' | 'analyze' | 'report' | 'view_details' | 'dismiss';
}

interface NotificationStats {
  total: number;
  unread: number;
  critical: number;
  todayCount: number;
  threatsPrevented: number;
}

interface NotificationSettings {
  enabled: boolean;
  pushEnabled: boolean;
  emailEnabled: boolean;
  criticalOnly: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  notificationTypes: {
    threatDetected: boolean;
    blockedContact: boolean;
    systemAlert: boolean;
    dailyTip: boolean;
    suspiciousActivity: boolean;
  };
}

class NotificationsService {
  private notifications: Notification[] = [
    {
      id: '1',
      type: 'threat_detected',
      severity: 'critical',
      title: '🚨 Amenaza Crítica Detectada',
      message: 'Se detectó un intento de phishing bancario. El mensaje ha sido bloqueado automáticamente.',
      timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 min ago
      read: false,
      actionRequired: true,
      relatedData: {
        phoneNumber: '+51 999 123 456',
        messagePreview: 'URGENTE: Su cuenta del Banco Nacional ha sido suspendida...',
        threatType: 'Phishing bancario',
        riskScore: 95,
      },
      actions: [
        { id: 'block', label: 'Bloquear Contacto', type: 'danger', action: 'block' },
        { id: 'report', label: 'Reportar', type: 'primary', action: 'report' },
        { id: 'details', label: 'Ver Detalles', type: 'secondary', action: 'view_details' },
      ],
    },
    {
      id: '2',
      type: 'suspicious_activity',
      severity: 'high',
      title: '⚠️ Actividad Sospechosa',
      message: 'Un contacto desconocido intentó enviarte un enlace acortado. Revisión recomendada.',
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 min ago
      read: false,
      actionRequired: true,
      relatedData: {
        phoneNumber: '+53 888 777 666',
        messagePreview: 'Hola! Mira este enlace bit.ly/xyz123...',
        threatType: 'URL acortada sospechosa',
        riskScore: 72,
      },
      actions: [
        { id: 'analyze', label: 'Analizar Mensaje', type: 'primary', action: 'analyze' },
        { id: 'block', label: 'Bloquear', type: 'danger', action: 'block' },
      ],
    },
    {
      id: '3',
      type: 'blocked_contact',
      severity: 'medium',
      title: '🛡️ Contacto Bloqueado',
      message: 'Se bloqueó automáticamente a +51 777 555 444 por envío repetido de mensajes sospechosos.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      read: false,
      actionRequired: false,
      relatedData: {
        phoneNumber: '+51 777 555 444',
        blockedContactId: '6',
      },
      actions: [
        { id: 'view', label: 'Ver Lista Negra', type: 'secondary', action: 'view_details' },
      ],
    },
    {
      id: '4',
      type: 'tip',
      severity: 'low',
      title: '💡 Consejo de Seguridad',
      message: 'Recuerda: Los bancos nunca te pedirán tu contraseña por mensaje o llamada.',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      read: true,
      actionRequired: false,
    },
    {
      id: '5',
      type: 'threat_detected',
      severity: 'high',
      title: '🚨 Phishing Detectado',
      message: 'Mensaje con premio falso bloqueado. Este tipo de estafa es común.',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      read: true,
      actionRequired: false,
      relatedData: {
        phoneNumber: '+51 666 444 222',
        messagePreview: '¡Felicidades! Has ganado $5000...',
        threatType: 'Premio falso / Estafa',
        riskScore: 88,
      },
    },
    {
      id: '6',
      type: 'system_alert',
      severity: 'low',
      title: '📢 Nueva Actualización Disponible',
      message: 'SafeChat v2.1 incluye mejoras en la detección de phishing. Actualiza ahora.',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      read: true,
      actionRequired: false,
    },
    {
      id: '7',
      type: 'suspicious_activity',
      severity: 'medium',
      title: '⚠️ Patrón Sospechoso',
      message: 'Detectamos 3 intentos de phishing en las últimas 24 horas. Mantente alerta.',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      read: true,
      actionRequired: false,
    },
    {
      id: '8',
      type: 'blocked_contact',
      severity: 'low',
      title: '🛡️ Protección Activa',
      message: 'SafeChat ha bloqueado 5 contactos sospechosos esta semana.',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      read: true,
      actionRequired: false,
    },
  ];

  private settings: NotificationSettings = {
    enabled: true,
    pushEnabled: true,
    emailEnabled: false,
    criticalOnly: false,
    quietHoursEnabled: false,
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00',
    notificationTypes: {
      threatDetected: true,
      blockedContact: true,
      systemAlert: true,
      dailyTip: true,
      suspiciousActivity: true,
    },
  };

  async getNotifications(filter?: {
    type?: Notification['type'];
    severity?: Notification['severity'];
    unreadOnly?: boolean;
  }): Promise<Notification[]> {
    await this.delay(400);
    
    let filtered = [...this.notifications];
    
    if (filter?.type) {
      filtered = filtered.filter(n => n.type === filter.type);
    }
    
    if (filter?.severity) {
      filtered = filtered.filter(n => n.severity === filter.severity);
    }
    
    if (filter?.unreadOnly) {
      filtered = filtered.filter(n => !n.read);
    }
    
    return filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async getNotificationById(id: string): Promise<Notification | null> {
    await this.delay(200);
    return this.notifications.find(n => n.id === id) || null;
  }

  async markAsRead(id: string): Promise<boolean> {
    await this.delay(300);
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      return true;
    }
    return false;
  }

  async markAllAsRead(): Promise<number> {
    await this.delay(400);
    const unreadCount = this.notifications.filter(n => !n.read).length;
    this.notifications.forEach(n => n.read = true);
    return unreadCount;
  }

  async deleteNotification(id: string): Promise<boolean> {
    await this.delay(300);
    const index = this.notifications.findIndex(n => n.id === id);
    if (index !== -1) {
      this.notifications.splice(index, 1);
      return true;
    }
    return false;
  }

  async clearAllNotifications(): Promise<number> {
    await this.delay(400);
    const count = this.notifications.length;
    this.notifications = [];
    return count;
  }

  async getStats(): Promise<NotificationStats> {
    await this.delay(200);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return {
      total: this.notifications.length,
      unread: this.notifications.filter(n => !n.read).length,
      critical: this.notifications.filter(n => n.severity === 'critical').length,
      todayCount: this.notifications.filter(n => n.timestamp >= today).length,
      threatsPrevented: this.notifications.filter(n => 
        n.type === 'threat_detected' || n.type === 'blocked_contact'
      ).length,
    };
  }

  async performAction(notificationId: string, actionId: string): Promise<boolean> {
    await this.delay(500);
    const notification = this.notifications.find(n => n.id === notificationId);
    
    if (!notification || !notification.actions) {
      return false;
    }

    const action = notification.actions.find(a => a.id === actionId);
    if (!action) {
      return false;
    }

    // Simular acción
    console.log(`Performing action ${action.action} for notification ${notificationId}`);
    
    // Marcar como leída después de la acción
    notification.read = true;
    
    return true;
  }

  async getSettings(): Promise<NotificationSettings> {
    await this.delay(200);
    return { ...this.settings };
  }

  async updateSettings(newSettings: Partial<NotificationSettings>): Promise<NotificationSettings> {
    await this.delay(300);
    this.settings = { ...this.settings, ...newSettings };
    return { ...this.settings };
  }

  async createNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): Promise<Notification> {
    await this.delay(300);
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    };
    this.notifications.unshift(newNotification);
    return newNotification;
  }

  // Simular recibir notificaciones en tiempo real
  async simulateIncomingNotification(): Promise<Notification> {
    await this.delay(1000);
    
    const templates: Array<Omit<Notification, 'id' | 'timestamp' | 'read'>> = [
      {
        type: 'threat_detected',
        severity: 'high',
        title: '🚨 Nueva Amenaza Detectada',
        message: 'Se detectó un mensaje con características de phishing.',
        actionRequired: true,
        relatedData: {
          phoneNumber: `+51 ${Math.floor(Math.random() * 900000000 + 100000000)}`,
          threatType: 'Phishing',
          riskScore: Math.floor(Math.random() * 30) + 70,
        },
      },
      {
        type: 'suspicious_activity',
        severity: 'medium',
        title: '⚠️ Actividad Inusual',
        message: 'Patrón sospechoso detectado en mensajes recientes.',
        actionRequired: false,
      },
    ];

    const template = templates[Math.floor(Math.random() * templates.length)];
    return this.createNotification(template);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const notificationsService = new NotificationsService();
export type { Notification, NotificationAction, NotificationSettings, NotificationStats };
