// services/analyzeService.ts
interface ThreatLevel {
  level: 'safe' | 'suspicious' | 'dangerous';
  score: number;
}

interface AnalysisResult {
  status: 'safe' | 'suspicious' | 'dangerous';
  threats: string[];
  recommendations: string[];
  details: {
    urls?: string[];
    suspiciousPatterns?: string[];
    riskScore: number;
  };
  timestamp: Date;
}

class AnalyzeService {
  private phishingKeywords = [
    'urgente', 'cuenta bloqueada', 'verificar', 'premio', 'ganaste',
    'haz clic aquí', 'confirma tu identidad', 'suspendido', 'caducado',
    'felicidades', 'reclama', 'tarjeta', 'banco', 'contraseña'
  ];

  private suspiciousPatterns = [
    /http[s]?:\/\/[^\s]+/gi, // URLs
    /\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}/g, // Números de tarjeta
    /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, // Emails
    /bit\.ly|tinyurl|shorturl/gi, // URL acortadas
  ];

  async analyzeMessage(message: string): Promise<AnalysisResult> {
    // Simular delay de red
    await this.delay(800 + Math.random() * 400);

    const lowerMessage = message.toLowerCase();
    const threats: string[] = [];
    const recommendations: string[] = [];
    const urls: string[] = [];
    const suspiciousPatterns: string[] = [];

    // Detectar URLs
    const urlMatches = message.match(this.suspiciousPatterns[0]);
    if (urlMatches) {
      urls.push(...urlMatches);
      threats.push('Enlaces sospechosos detectados');
      suspiciousPatterns.push('URLs en el mensaje');
    }

    // Detectar palabras clave de phishing
    const foundKeywords = this.phishingKeywords.filter(keyword => 
      lowerMessage.includes(keyword)
    );
    
    if (foundKeywords.length > 0) {
      threats.push(`Palabras clave sospechosas: ${foundKeywords.slice(0, 3).join(', ')}`);
    }

    // Detectar números de tarjeta
    if (this.suspiciousPatterns[1].test(message)) {
      threats.push('Solicitud de información bancaria');
      suspiciousPatterns.push('Patrón de tarjeta de crédito');
    }

    // Detectar URLs acortadas
    if (this.suspiciousPatterns[3].test(message)) {
      threats.push('URL acortada detectada (alto riesgo)');
      suspiciousPatterns.push('Servicio de acortamiento de enlaces');
    }

    // Calcular nivel de riesgo
    const riskScore = this.calculateRiskScore(
      foundKeywords.length,
      urls.length,
      suspiciousPatterns.length
    );

    // Determinar estado
    let status: 'safe' | 'suspicious' | 'dangerous';
    if (riskScore < 30) {
      status = 'safe';
      recommendations.push('El mensaje parece seguro');
    } else if (riskScore < 70) {
      status = 'suspicious';
      recommendations.push('Verifica la identidad del remitente');
      recommendations.push('No compartas información personal');
      recommendations.push('Contacta directamente a la empresa si es necesario');
    } else {
      status = 'dangerous';
      recommendations.push('⚠️ NO respondas a este mensaje');
      recommendations.push('⚠️ NO hagas clic en enlaces');
      recommendations.push('Bloquea y reporta al remitente');
      recommendations.push('Si compartiste datos, cambia tus contraseñas inmediatamente');
    }

    return {
      status,
      threats: threats.length > 0 ? threats : ['No se detectaron amenazas evidentes'],
      recommendations,
      details: {
        urls: urls.length > 0 ? urls : undefined,
        suspiciousPatterns: suspiciousPatterns.length > 0 ? suspiciousPatterns : undefined,
        riskScore,
      },
      timestamp: new Date(),
    };
  }

  private calculateRiskScore(keywords: number, urls: number, patterns: number): number {
    let score = 0;
    score += keywords * 15; // Cada keyword suma 15 puntos
    score += urls * 20; // Cada URL suma 20 puntos
    score += patterns * 25; // Cada patrón sospechoso suma 25 puntos
    return Math.min(100, score);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async reportMessage(message: string, analysis: AnalysisResult): Promise<boolean> {
    await this.delay(500);
    console.log('Mensaje reportado:', { message, analysis });
    return true;
  }
}

export const analyzeService = new AnalyzeService();
export type { AnalysisResult };
