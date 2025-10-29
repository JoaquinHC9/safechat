// services/tipsService.ts
interface SecurityTip {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'prevention' | 'detection' | 'response';
  priority: 'high' | 'medium' | 'low';
}

interface PhishingExample {
  id: string;
  message: string;
  isPhishing: boolean;
  explanation: string;
  indicators: string[];
}

class TipsService {
  private tips: SecurityTip[] = [
    {
      id: '1',
      title: 'Verifica el remitente',
      description: 'Siempre confirma la identidad del remitente antes de responder a mensajes sospechosos. Las empresas legítimas nunca te pedirán contraseñas por mensaje.',
      icon: 'account-check',
      category: 'prevention',
      priority: 'high',
    },
    {
      id: '2',
      title: 'Cuidado con urgencias',
      description: 'Los estafadores crean sensación de urgencia para que actúes sin pensar. Tómate tu tiempo para verificar.',
      icon: 'clock-alert',
      category: 'detection',
      priority: 'high',
    },
    {
      id: '3',
      title: 'No hagas clic en enlaces desconocidos',
      description: 'Los enlaces pueden llevarte a sitios fraudulentos. Si recibes un enlace inesperado, verifica manualmente la URL.',
      icon: 'link-off',
      category: 'prevention',
      priority: 'high',
    },
    {
      id: '4',
      title: 'Usa autenticación de dos factores',
      description: 'La 2FA añade una capa extra de seguridad. Incluso si roban tu contraseña, no podrán acceder a tu cuenta.',
      icon: 'shield-lock',
      category: 'prevention',
      priority: 'medium',
    },
    {
      id: '5',
      title: 'Verifica errores ortográficos',
      description: 'Los mensajes de phishing suelen tener errores gramaticales o de ortografía. Las empresas profesionales revisan sus comunicaciones.',
      icon: 'spellcheck',
      category: 'detection',
      priority: 'medium',
    },
    {
      id: '6',
      title: 'Protege tu información personal',
      description: 'Nunca compartas datos sensibles como contraseñas, códigos de tarjeta o números de documento por mensaje.',
      icon: 'lock',
      category: 'prevention',
      priority: 'high',
    },
    {
      id: '7',
      title: 'Desconfía de premios inesperados',
      description: 'Si no participaste en un sorteo, es muy probable que el "premio" sea una estafa para obtener tus datos.',
      icon: 'gift-off',
      category: 'detection',
      priority: 'medium',
    },
  ];

  private examples: PhishingExample[] = [
    {
      id: '1',
      message: '¡URGENTE! Su cuenta bancaria ha sido suspendida. Haga clic aquí para verificar: bit.ly/xyz123',
      isPhishing: true,
      explanation: 'Este es un clásico intento de phishing. Usa urgencia, URL acortada y solicita acción inmediata.',
      indicators: ['Urgencia artificial', 'URL acortada', 'Suspensión de cuenta sin previo aviso'],
    },
    {
      id: '2',
      message: 'Hola! Te escribo para confirmar nuestra reunión de mañana a las 3pm. ¿Te viene bien?',
      isPhishing: false,
      explanation: 'Este mensaje es legítimo. Es una confirmación normal sin solicitudes sospechosas.',
      indicators: ['Sin solicitud de datos', 'Sin enlaces', 'Contexto normal'],
    },
    {
      id: '3',
      message: 'Felicidades! Has ganado $5000. Para reclamar tu premio, envía tus datos: nombre, DNI y número de tarjeta.',
      isPhishing: true,
      explanation: 'Estafa clásica de premio falso. Solicita información sensible sin razón válida.',
      indicators: ['Premio no solicitado', 'Solicitud de datos personales', 'Solicitud de info bancaria'],
    },
  ];

  async getDailyTip(): Promise<SecurityTip> {
    await this.delay(300);
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const index = dayOfYear % this.tips.length;
    return this.tips[index];
  }

  async getAllTips(): Promise<SecurityTip[]> {
    await this.delay(400);
    return [...this.tips];
  }

  async getTipsByCategory(category: SecurityTip['category']): Promise<SecurityTip[]> {
    await this.delay(300);
    return this.tips.filter(tip => tip.category === category);
  }

  async getPhishingExamples(): Promise<PhishingExample[]> {
    await this.delay(500);
    return [...this.examples];
  }

  async getRandomExample(): Promise<PhishingExample> {
    await this.delay(300);
    const randomIndex = Math.floor(Math.random() * this.examples.length);
    return this.examples[randomIndex];
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const tipsService = new TipsService();
export type { PhishingExample, SecurityTip };
