import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Card, Chip, Dialog, Portal, ProgressBar, Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SimulationResult, SimulationScenario, simulationsService, UserProgress } from '../services/simulationsService';

export const Simulations = () => {
  const { colors } = useTheme();
  const [scenarios, setScenarios] = useState<SimulationScenario[]>([]);
  const [currentScenario, setCurrentScenario] = useState<SimulationScenario | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [hintsRevealed, setHintsRevealed] = useState<number>(0);
  const [showResult, setShowResult] = useState(false);
  const [lastResult, setLastResult] = useState<SimulationResult | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [allScenarios, userProgress] = await Promise.all([
        simulationsService.getScenarios(),
        simulationsService.getUserProgress(),
      ]);
      setScenarios(allScenarios);
      setProgress(userProgress);
    } catch (error) {
      console.error('Error loading simulations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startSimulation = async (scenario?: SimulationScenario) => {
    try {
      const selectedScenario = scenario || await simulationsService.getRandomScenario(
        selectedDifficulty === 'all' ? undefined : selectedDifficulty
      );
      setCurrentScenario(selectedScenario);
      setStartTime(Date.now());
      setHintsRevealed(0);
      setIsSimulating(true);
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar la simulación');
    }
  };

  const submitAnswer = async (answer: boolean) => {
    if (!currentScenario) return;

    const timeSpent = Date.now() - startTime;
    
    try {
      const result = await simulationsService.submitAnswer(
        currentScenario.id,
        answer,
        timeSpent,
        hintsRevealed
      );
      
      setLastResult(result);
      setShowResult(true);
      
      // Actualizar progreso
      const newProgress = await simulationsService.getUserProgress();
      setProgress(newProgress);
    } catch (error) {
      Alert.alert('Error', 'No se pudo procesar la respuesta');
    }
  };

  const closeResult = () => {
    setShowResult(false);
    setIsSimulating(false);
    setCurrentScenario(null);
    setLastResult(null);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'hard': return '#F44336';
      default: return colors.primary;
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Fácil';
      case 'medium': return 'Medio';
      case 'hard': return 'Difícil';
      default: return difficulty;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'banking': return 'bank';
      case 'social': return 'account-group';
      case 'ecommerce': return 'cart';
      case 'government': return 'domain';
      default: return 'message';
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.onSurface, marginTop: 12 }}>
          Cargando simulaciones...
        </Text>
      </View>
    );
  }

  // Vista de simulación activa
  if (isSimulating && currentScenario) {
    return (
      <View style={[styles.simulationContainer, { backgroundColor: colors.background }]}>
        <ScrollView contentContainerStyle={styles.simulationContent}>
          {/* Header */}
          <Card style={styles.headerCard} mode="elevated">
            <Card.Content>
              <View style={styles.simulationHeader}>
                <View style={styles.scenarioInfo}>
                  <Text variant="labelSmall" style={{ color: colors.onSurfaceVariant }}>
                    Escenario de Práctica
                  </Text>
                  <Text variant="titleLarge" style={[styles.scenarioTitle, { color: colors.onSurface }]}>
                    {currentScenario.title}
                  </Text>
                </View>
                <Chip
                  mode="flat"
                  style={[styles.difficultyChip, { backgroundColor: getDifficultyColor(currentScenario.difficulty) + '30' }]}
                  textStyle={{ color: getDifficultyColor(currentScenario.difficulty), fontWeight: 'bold' }}
                >
                  {getDifficultyLabel(currentScenario.difficulty)}
                </Chip>
              </View>
            </Card.Content>
          </Card>

          {/* Mensaje a analizar */}
          <Card style={styles.messageCard} mode="elevated">
            <Card.Content>
              <View style={styles.messageHeader}>
                <Icon name="message-text" size={24} color={colors.primary} />
                <Text variant="titleMedium" style={[styles.cardTitle, { color: colors.onSurface }]}>
                  Mensaje Recibido
                </Text>
              </View>
              <View style={[styles.messageBox, { backgroundColor: colors.surface, borderColor: colors.outline }]}>
                <Text style={[styles.messageText, { color: colors.onSurface }]}>
                  {currentScenario.message}
                </Text>
              </View>
              <View style={styles.categoryTag}>
                <Icon name={getCategoryIcon(currentScenario.category)} size={16} color={colors.onSurfaceVariant} />
                <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
                  Categoría: {currentScenario.category}
                </Text>
              </View>
            </Card.Content>
          </Card>

          {/* Pistas */}
          <Card style={styles.hintsCard} mode="outlined">
            <Card.Content>
              <View style={styles.hintsHeader}>
                <Icon name="lightbulb" size={20} color="#FFC107" />
                <Text variant="titleMedium" style={{ color: colors.onSurface, fontWeight: 'bold' }}>
                  Pistas ({hintsRevealed}/{currentScenario.hints.length})
                </Text>
              </View>
              
              {hintsRevealed > 0 ? (
                currentScenario.hints.slice(0, hintsRevealed).map((hint, index) => (
                  <View key={index} style={styles.hintItem}>
                    <Icon name="arrow-right-circle" size={18} color="#FFC107" />
                    <Text style={[styles.hintText, { color: colors.onSurface }]}>
                      {hint}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={{ color: colors.onSurfaceVariant, fontStyle: 'italic' }}>
                  Pulsa "Revelar Pista" si necesitas ayuda (reduce tu puntuación)
                </Text>
              )}

              {hintsRevealed < currentScenario.hints.length && (
                <Button
                  mode="outlined"
                  onPress={() => setHintsRevealed(hintsRevealed + 1)}
                  style={styles.hintButton}
                  icon="lightbulb-on"
                >
                  Revelar Pista (-15 puntos)
                </Button>
              )}
            </Card.Content>
          </Card>

          {/* Botones de respuesta */}
          <View style={styles.answerButtons}>
            <Text variant="titleMedium" style={[styles.questionText, { color: colors.onSurface }]}>
              ¿Este mensaje es phishing?
            </Text>
            <View style={styles.buttonRow}>
              <Button
                mode="contained"
                buttonColor="#F44336"
                onPress={() => submitAnswer(true)}
                style={styles.answerButton}
                contentStyle={styles.answerButtonContent}
                icon="alert-octagon"
              >
                Sí, es Phishing
              </Button>
              <Button
                mode="contained"
                buttonColor="#4CAF50"
                onPress={() => submitAnswer(false)}
                style={styles.answerButton}
                contentStyle={styles.answerButtonContent}
                icon="check-circle"
              >
                No, es Seguro
              </Button>
            </View>
          </View>
        </ScrollView>

        {/* Botón para cancelar */}
        <View style={styles.cancelContainer}>
          <Button
            mode="text"
            onPress={() => {
              Alert.alert(
                'Cancelar Simulación',
                '¿Estás seguro? No se guardará tu progreso.',
                [
                  { text: 'Continuar', style: 'cancel' },
                  { text: 'Salir', onPress: () => setIsSimulating(false), style: 'destructive' }
                ]
              );
            }}
            icon="close"
          >
            Cancelar
          </Button>
        </View>

        {/* Dialog de resultado */}
        <Portal>
          <Dialog visible={showResult} onDismiss={closeResult}>
            <Dialog.Title>
              {lastResult?.correct ? '¡Correcto! 🎉' : 'Incorrecto 😔'}
            </Dialog.Title>
            <Dialog.Content>
              <View style={styles.resultContent}>
                <View style={styles.scoreDisplay}>
                  <Text variant="headlineLarge" style={{ 
                    color: lastResult?.correct ? '#4CAF50' : '#F44336',
                    fontWeight: 'bold'
                  }}>
                    {lastResult?.score}
                  </Text>
                  <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant }}>
                    puntos
                  </Text>
                </View>

                <View style={styles.resultStats}>
                  <View style={styles.resultStat}>
                    <Icon name="clock-outline" size={20} color={colors.onSurfaceVariant} />
                    <Text style={{ color: colors.onSurface }}>
                      {Math.round((lastResult?.timeSpent || 0) / 1000)}s
                    </Text>
                  </View>
                  <View style={styles.resultStat}>
                    <Icon name="lightbulb-outline" size={20} color={colors.onSurfaceVariant} />
                    <Text style={{ color: colors.onSurface }}>
                      {lastResult?.hintsUsed || 0} pistas
                    </Text>
                  </View>
                </View>

                <Text variant="titleMedium" style={{ color: colors.onSurface, marginTop: 16, fontWeight: 'bold' }}>
                  Explicación:
                </Text>
                <Text style={{ color: colors.onSurfaceVariant, marginTop: 8, lineHeight: 22 }}>
                  {currentScenario.explanation}
                </Text>
              </View>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={closeResult}>Continuar</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    );
  }

  // Vista principal (selección de escenarios)
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={styles.container}
    >
      {/* Progreso del usuario */}
      {progress && (
        <Card style={styles.progressCard} mode="elevated">
          <Card.Content>
            <View style={styles.progressHeader}>
              <View>
                <Text variant="labelSmall" style={{ color: colors.onSurfaceVariant }}>
                  Tu Progreso
                </Text>
                <Text variant="headlineSmall" style={[styles.levelText, { color: colors.primary }]}>
                  Nivel {progress.level}
                </Text>
              </View>
              <Icon name="trophy" size={40} color="#FFC107" />
            </View>
            
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text variant="headlineMedium" style={[styles.statValue, { color: '#4CAF50' }]}>
                  {progress.totalCompleted}
                </Text>
                <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
                  Completados
                </Text>
              </View>
              <View style={styles.statBox}>
                <Text variant="headlineMedium" style={[styles.statValue, { color: '#2196F3' }]}>
                  {progress.correctAnswers}
                </Text>
                <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
                  Correctos
                </Text>
              </View>
              <View style={styles.statBox}>
                <Text variant="headlineMedium" style={[styles.statValue, { color: '#FF9800' }]}>
                  {Math.round(progress.accuracy)}%
                </Text>
                <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
                  Precisión
                </Text>
              </View>
            </View>

            <ProgressBar 
              progress={progress.accuracy / 100} 
              color="#4CAF50" 
              style={styles.progressBar}
            />
          </Card.Content>
        </Card>
      )}

      {/* Inicio rápido */}
      <Card style={styles.quickStartCard} mode="elevated">
        <Card.Content>
          <View style={styles.quickStartHeader}>
            <Icon name="play-circle" size={28} color={colors.primary} />
            <Text variant="titleLarge" style={[styles.quickStartTitle, { color: colors.onSurface }]}>
              Inicio Rápido
            </Text>
          </View>
          <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant, marginBottom: 16 }}>
            Practica identificando mensajes de phishing con escenarios realistas
          </Text>

          {/* Filtro de dificultad */}
          <View style={styles.difficultyFilter}>
            {(['all', 'easy', 'medium', 'hard'] as const).map((diff) => (
              <Chip
                key={diff}
                mode={selectedDifficulty === diff ? 'flat' : 'outlined'}
                selected={selectedDifficulty === diff}
                onPress={() => setSelectedDifficulty(diff)}
                style={styles.filterChip}
              >
                {diff === 'all' ? 'Todos' : getDifficultyLabel(diff)}
              </Chip>
            ))}
          </View>

          <Button
            mode="contained"
            onPress={() => startSimulation()}
            style={styles.startButton}
            contentStyle={styles.startButtonContent}
            icon="rocket-launch"
          >
            Comenzar Simulación Aleatoria
          </Button>
        </Card.Content>
      </Card>

      {/* Lista de escenarios */}
      <Card style={styles.scenariosCard} mode="elevated">
        <Card.Content>
          <View style={styles.scenariosHeader}>
            <Icon name="format-list-bulleted" size={24} color={colors.primary} />
            <Text variant="titleLarge" style={[styles.scenariosTitle, { color: colors.onSurface }]}>
              Todos los Escenarios
            </Text>
          </View>

          {scenarios
            .filter(s => selectedDifficulty === 'all' || s.difficulty === selectedDifficulty)
            .map((scenario) => (
            <Card
              key={scenario.id}
              style={styles.scenarioCard}
              mode="outlined"
              onPress={() => startSimulation(scenario)}
            >
              <Card.Content>
                <View style={styles.scenarioCardHeader}>
                  <View style={styles.scenarioCardInfo}>
                    <Text variant="titleMedium" style={{ color: colors.onSurface, fontWeight: 'bold' }}>
                      {scenario.title}
                    </Text>
                    <View style={styles.scenarioTags}>
                      <Chip
                        mode="flat"
                        style={[styles.scenarioDifficultyChip, { 
                          backgroundColor: getDifficultyColor(scenario.difficulty) + '30' 
                        }]}
                        textStyle={{ 
                          color: getDifficultyColor(scenario.difficulty), 
                          fontSize: 11,
                          fontWeight: 'bold'
                        }}
                      >
                        {getDifficultyLabel(scenario.difficulty)}
                      </Chip>
                      <Icon name={getCategoryIcon(scenario.category)} size={16} color={colors.onSurfaceVariant} />
                    </View>
                  </View>
                  <Icon name="chevron-right" size={24} color={colors.primary} />
                </View>
              </Card.Content>
            </Card>
          ))}
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressCard: {
    borderRadius: 16,
    elevation: 3,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  levelText: {
    fontWeight: 'bold',
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    fontWeight: 'bold',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  quickStartCard: {
    borderRadius: 16,
    elevation: 2,
  },
  quickStartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  quickStartTitle: {
    fontWeight: 'bold',
  },
  difficultyFilter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  filterChip: {
    minWidth: 70,
  },
  startButton: {
    borderRadius: 12,
  },
  startButtonContent: {
    paddingVertical: 8,
  },
  scenariosCard: {
    borderRadius: 16,
    elevation: 2,
  },
  scenariosHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  scenariosTitle: {
    fontWeight: 'bold',
  },
  scenarioCard: {
    marginBottom: 12,
    borderRadius: 12,
  },
  scenarioCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scenarioCardInfo: {
    flex: 1,
    gap: 8,
  },
  scenarioTags: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scenarioDifficultyChip: {
    height: 24,
  },
  
  // Estilos de simulación activa
  simulationContainer: {
    flex: 1,
  },
  simulationContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 80,
  },
  headerCard: {
    borderRadius: 16,
    elevation: 3,
  },
  simulationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  scenarioInfo: {
    flex: 1,
  },
  scenarioTitle: {
    fontWeight: 'bold',
    marginTop: 4,
  },
  difficultyChip: {
    height: 28,
  },
  messageCard: {
    borderRadius: 16,
    elevation: 2,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  cardTitle: {
    fontWeight: 'bold',
  },
  messageBox: {
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 24,
  },
  categoryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  hintsCard: {
    borderRadius: 16,
  },
  hintsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  hintItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
    paddingLeft: 8,
  },
  hintText: {
    flex: 1,
    lineHeight: 22,
  },
  hintButton: {
    marginTop: 12,
    borderRadius: 8,
  },
  answerButtons: {
    gap: 16,
  },
  questionText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  answerButton: {
    flex: 1,
    borderRadius: 12,
  },
  answerButtonContent: {
    paddingVertical: 12,
  },
  cancelContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
  },
  resultContent: {
    gap: 12,
  },
  scoreDisplay: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  resultStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  resultStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});

export default Simulations;