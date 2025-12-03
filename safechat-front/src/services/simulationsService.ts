// services/simulationsService.ts
interface SimulationScenario {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  message: string;
  isPhishing: boolean;
  hints: string[];
  explanation: string;
  category: 'banking' | 'social' | 'ecommerce' | 'government';
}

interface SimulationResult {
  correct: boolean;
  timeSpent: number;
  hintsUsed: number;
  score: number;
}

interface UserProgress {
  totalCompleted: number;
  correctAnswers: number;
  accuracy: number;
  averageTime: number;
  level: number;
}

class SimulationsService {
  private scenarios: SimulationScenario[] = [
    {
      id: '1',
      title: 'Suspensión de Cuenta Bancaria',
      difficulty: 'easy',
      message: '⚠️ URGENTE: Su cuenta del Banco Nacional ha sido suspendida por actividad sospechosa. Haga clic aquí para verificar su identidad: bit.ly/bn-verify-234',
      isPhishing: true,
      hints: [
        'Fíjate en la sensación de urgencia',
        'Los bancos no usan URLs acortadas',
        'Verifica si el banco te contactaría así'
      ],
      explanation: 'Este es un intento clásico de phishing. Los bancos nunca solicitan verificación de identidad por mensaje con enlaces acortados. La urgencia artificial es una táctica común para que actúes sin pensar.',
      category: 'banking',
    },
    {
      id: '2',
      title: 'Confirmación de Reunión',
      difficulty: 'easy',
      message: 'Hola! Solo confirmo nuestra reunión de mañana a las 10am en la oficina. ¿Necesitas que lleve algo específico?',
      isPhishing: false,
      hints: [
        'No hay solicitud de información personal',
        'No contiene enlaces sospechosos',
        'El contexto parece legítimo'
      ],
      explanation: 'Este es un mensaje legítimo. Es una simple confirmación de reunión sin solicitudes sospechosas, enlaces o peticiones de información sensible.',
      category: 'social',
    },
    {
      id: '3',
      title: 'Premio de Lotería',
      difficulty: 'medium',
      message: '🎉 ¡FELICIDADES! Has sido seleccionado como ganador de S/. 50,000 en nuestro sorteo anual. Para reclamar tu premio, necesitamos: - Nombre completo - DNI - Número de cuenta bancaria Responde en 24 horas o perderás tu premio.',
      isPhishing: true,
      hints: [
        'No participaste en ningún sorteo',
        'Solicitan información bancaria sensible',
        'Presión de tiempo artificial'
      ],
      explanation: 'Estafa clásica de premio falso. Nadie te dará dinero sin que hayas participado en un sorteo legítimo. La solicitud de datos bancarios y la presión de tiempo son señales claras de phishing.',
      category: 'social',
    },
    {
      id: '4',
      title: 'Actualización de Datos SUNAT',
      difficulty: 'medium',
      message: 'SUNAT: Debe actualizar sus datos fiscales para evitar sanciones. Ingrese a: sunat-actualizacion.com/datos con su RUC y clave SOL. Plazo: 48 horas.',
      isPhishing: true,
      hints: [
        'Verifica el dominio web (no es oficial)',
        'SUNAT no solicita claves por mensaje',
        'Amenaza de sanciones para crear miedo'
      ],
      explanation: 'Phishing dirigido a datos fiscales. El dominio no es oficial (sunat.gob.pe es el correcto). SUNAT nunca solicita credenciales por mensaje y no usa amenazas de esta manera.',
      category: 'government',
    },
    {
      id: '5',
      title: 'Notificación de Entrega',
      difficulty: 'medium',
      message: 'Tu paquete está en camino. Número de seguimiento: PE7654321. Entrega estimada: Mañana entre 9am-1pm. Puedes rastrear tu envío en nuestra app.',
      isPhishing: false,
      hints: [
        'Información específica y coherente',
        'No solicita datos personales',
        'Menciona la app oficial, no un enlace'
      ],
      explanation: 'Mensaje legítimo de servicio de paquetería. Proporciona información específica de seguimiento sin solicitar datos ni contener enlaces sospechosos.',
      category: 'ecommerce',
    },
    {
      id: '6',
      title: 'Reembolso de Tarjeta',
      difficulty: 'hard',
      message: 'Estimado cliente, hemos detectado un cargo duplicado de $89.99 en su tarjeta VISA terminada en 4523. Procesaremos el reembolso automáticamente. Si no reconoce este cargo, responda con: NOMBRE COMPLETO, NUMERO COMPLETO DE TARJETA, CVV para verificación.',
      isPhishing: true,
      hints: [
        'Solicitan el número completo de tarjeta',
        'Piden el CVV (nunca se debe compartir)',
        'Usan información parcial para parecer legítimos'
      ],
      explanation: 'Phishing sofisticado. Aunque mencionan los últimos dígitos de una tarjeta (que podrían haber obtenido de otra fuente), ninguna entidad legítima solicita el número completo y CVV por mensaje.',
      category: 'banking',
    },
    {
      id: '7',
      title: 'Problema con Pedido Amazon',
      difficulty: 'hard',
      message: 'Amazon: Problema con su pedido #PE-7834-2938. Su paquete no pudo ser entregado. Para reprogramar, verifique su dirección en: amazon-pe-entrega.com Use su correo y contraseña de Amazon para confirmar.',
      isPhishing: true,
      hints: [
        'El dominio no es oficial (amazon.com.pe)',
        'Solicitan contraseña (Amazon nunca lo haría)',
        'Número de pedido falso'
      ],
      explanation: 'Phishing que imita a Amazon. El dominio es fraudulento y Amazon nunca solicitaría tu contraseña. Los números de pedido reales de Amazon tienen un formato específico diferente.',
      category: 'ecommerce',
    },
    {
      id: '8',
      title: 'Recordatorio de Cita Médica',
      difficulty: 'easy',
      message: 'Clínica Santa María: Le recordamos su cita con el Dr. García el 30/10/2025 a las 4:30pm. Consultorio 305. Si necesita reprogramar, llame al 01-234-5678.',
      isPhishing: false,
      hints: [
        'Información específica y detallada',
        'Proporciona número de teléfono para contacto',
        'No solicita información ni contiene enlaces'
      ],
      explanation: 'Recordatorio legítimo de cita médica. Contiene información específica, proporciona un número de contacto oficial y no solicita datos sensibles ni contiene enlaces sospechosos.',
      category: 'social',
    },
  ];

  private userProgress: UserProgress = {
    totalCompleted: 0,
    correctAnswers: 0,
    accuracy: 0,
    averageTime: 0,
    level: 1,
  };

  async getScenarios(difficulty?: SimulationScenario['difficulty']): Promise<SimulationScenario[]> {
    await this.delay(400);
    if (difficulty) {
      return this.scenarios.filter(s => s.difficulty === difficulty);
    }
    return [...this.scenarios];
  }

  async getScenario(id: string): Promise<SimulationScenario | null> {
    await this.delay(300);
    return this.scenarios.find(s => s.id === id) || null;
  }

  async getRandomScenario(difficulty?: SimulationScenario['difficulty']): Promise<SimulationScenario> {
    await this.delay(300);
    const filtered = difficulty 
      ? this.scenarios.filter(s => s.difficulty === difficulty)
      : this.scenarios;
    const randomIndex = Math.floor(Math.random() * filtered.length);
    return filtered[randomIndex];
  }

  async submitAnswer(
    scenarioId: string,
    userAnswer: boolean,
    timeSpent: number,
    hintsUsed: number
  ): Promise<SimulationResult> {
    await this.delay(500);
    
    const scenario = this.scenarios.find(s => s.id === scenarioId);
    if (!scenario) {
      throw new Error('Scenario not found');
    }

    const correct = userAnswer === scenario.isPhishing;
    
    // Calcular puntuación
    let score = correct ? 100 : 0;
    
    // Penalizar por pistas usadas
    score -= hintsUsed * 15;
    
    // Bonus por velocidad (si es correcto)
    if (correct && timeSpent < 30000) {
      score += 20;
    }
    
    // Bonus por dificultad
    const difficultyBonus = {
      easy: 0,
      medium: 10,
      hard: 25,
    };
    score += difficultyBonus[scenario.difficulty];
    
    score = Math.max(0, Math.min(100, score));

    // Actualizar progreso
    this.userProgress.totalCompleted++;
    if (correct) {
      this.userProgress.correctAnswers++;
    }
    this.userProgress.accuracy = 
      (this.userProgress.correctAnswers / this.userProgress.totalCompleted) * 100;
    
    // Calcular nivel
    this.userProgress.level = Math.floor(this.userProgress.totalCompleted / 5) + 1;

    return {
      correct,
      timeSpent,
      hintsUsed,
      score,
    };
  }

  async getUserProgress(): Promise<UserProgress> {
    await this.delay(200);
    return { ...this.userProgress };
  }

  async resetProgress(): Promise<void> {
    await this.delay(300);
    this.userProgress = {
      totalCompleted: 0,
      correctAnswers: 0,
      accuracy: 0,
      averageTime: 0,
      level: 1,
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const simulationsService = new SimulationsService();
export type { SimulationResult, SimulationScenario, UserProgress };
