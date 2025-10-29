import React, { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { ActivityIndicator, Button, Card, Chip, Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AnalysisResult, analyzeService } from '../services/analyzeService';

export const Analyze = () => {
  const { colors } = useTheme();
  const [mensaje, setMensaje] = useState('');
  const [resultado, setResultado] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isReporting, setIsReporting] = useState(false);

  const handleAnalizar = async () => {
    if (!mensaje.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeService.analyzeMessage(mensaje);
      setResultado(analysis);
    } catch (error) {
      console.error('Error al analizar:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReportar = async () => {
    if (!resultado) return;
    
    setIsReporting(true);
    try {
      await analyzeService.reportMessage(mensaje, resultado);
      alert('✓ Mensaje reportado exitosamente');
    } catch (error) {
      alert('Error al reportar el mensaje');
    } finally {
      setIsReporting(false);
    }
  };

  const handleLimpiar = () => {
    setMensaje('');
    setResultado(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe': return '#4CAF50';
      case 'suspicious': return '#FF9800';
      case 'dangerous': return '#F44336';
      default: return colors.primary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'safe': return 'shield-check';
      case 'suspicious': return 'alert';
      case 'dangerous': return 'shield-alert';
      default: return 'shield';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'safe': return 'SEGURO';
      case 'suspicious': return 'SOSPECHOSO';
      case 'dangerous': return 'PELIGROSO';
      default: return 'DESCONOCIDO';
    }
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Card de entrada */}
      <Card style={styles.card} mode="elevated">
        <Card.Content>
          <View style={styles.headerWithIcon}>
            <Icon name="message-text" size={24} color={colors.primary} />
            <Text variant="titleLarge" style={[styles.cardTitle, { color: colors.onSurface }]}>
              Analizar Mensaje
            </Text>
          </View>
          
          <Text variant="bodyMedium" style={[styles.description, { color: colors.onSurfaceVariant }]}>
            Pega aquí el mensaje que deseas verificar
          </Text>

          <TextInput
            multiline
            numberOfLines={6}
            placeholder="Ej: ¡URGENTE! Tu cuenta ha sido suspendida. Haz clic aquí para verificar..."
            placeholderTextColor={colors.onSurfaceVariant}
            value={mensaje}
            onChangeText={setMensaje}
            style={[
              styles.textArea,
              {
                color: colors.onSurface,
                borderColor: colors.outline,
                backgroundColor: colors.surface,
              }
            ]}
          />

          <View style={styles.buttonRow}>
            <Button
              mode="contained"
              onPress={handleAnalizar}
              disabled={!mensaje.trim() || isAnalyzing}
              style={styles.primaryButton}
              contentStyle={styles.buttonContent}
              icon="shield-search"
            >
              {isAnalyzing ? 'Analizando...' : 'Analizar'}
            </Button>
            
            {mensaje.trim() && (
              <Button
                mode="outlined"
                onPress={handleLimpiar}
                style={styles.secondaryButton}
                contentStyle={styles.buttonContent}
                icon="broom"
              >
                Limpiar
              </Button>
            )}
          </View>
        </Card.Content>
      </Card>

      {/* Indicador de carga */}
      {isAnalyzing && (
        <Card style={styles.card} mode="elevated">
          <Card.Content style={styles.loadingCard}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={{ color: colors.onSurface, marginTop: 12 }}>
              Analizando amenazas...
            </Text>
          </Card.Content>
        </Card>
      )}

      {/* Card de resultados */}
      {resultado && !isAnalyzing && (
        <Card style={styles.card} mode="elevated">
          <Card.Content>
            <View style={styles.resultHeader}>
              <View style={styles.statusContainer}>
                <Icon 
                  name={getStatusIcon(resultado.status)} 
                  size={32} 
                  color={getStatusColor(resultado.status)} 
                />
                <View style={styles.statusTextContainer}>
                  <Text variant="labelSmall" style={{ color: colors.onSurfaceVariant }}>
                    Estado del mensaje
                  </Text>
                  <Text 
                    variant="titleLarge" 
                    style={[styles.statusText, { color: getStatusColor(resultado.status) }]}
                  >
                    {getStatusText(resultado.status)}
                  </Text>
                </View>
              </View>
              
              <Chip 
                icon="chart-donut" 
                mode="outlined"
                style={[styles.riskChip, { borderColor: getStatusColor(resultado.status) }]}
              >
                Riesgo: {resultado.details.riskScore}%
              </Chip>
            </View>

            {/* Amenazas detectadas */}
            <View style={styles.section}>
              <Text variant="titleMedium" style={[styles.sectionTitle, { color: colors.onSurface }]}>
                🔍 Amenazas Identificadas
              </Text>
              {resultado.threats.map((threat, index) => (
                <View key={index} style={styles.threatItem}>
                  <Icon name="alert-circle" size={18} color="#FF9800" />
                  <Text style={[styles.threatText, { color: colors.onSurface }]}>
                    {threat}
                  </Text>
                </View>
              ))}
            </View>

            {/* Detalles adicionales */}
            {(resultado.details.urls || resultado.details.suspiciousPatterns) && (
              <View style={styles.section}>
                <Text variant="titleMedium" style={[styles.sectionTitle, { color: colors.onSurface }]}>
                  📋 Detalles Técnicos
                </Text>
                {resultado.details.urls && (
                  <View style={styles.detailItem}>
                    <Text style={{ color: colors.onSurfaceVariant, fontWeight: 'bold' }}>
                      URLs detectadas:
                    </Text>
                    {resultado.details.urls.map((url, idx) => (
                      <Text key={idx} style={[styles.urlText, { color: colors.error }]}>
                        • {url}
                      </Text>
                    ))}
                  </View>
                )}
                {resultado.details.suspiciousPatterns && (
                  <View style={styles.detailItem}>
                    <Text style={{ color: colors.onSurfaceVariant, fontWeight: 'bold' }}>
                      Patrones sospechosos:
                    </Text>
                    {resultado.details.suspiciousPatterns.map((pattern, idx) => (
                      <Text key={idx} style={{ color: colors.onSurface }}>
                        • {pattern}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            )}

            {/* Recomendaciones */}
            <View style={styles.section}>
              <Text variant="titleMedium" style={[styles.sectionTitle, { color: colors.onSurface }]}>
                💡 Recomendaciones
              </Text>
              {resultado.recommendations.map((rec, index) => (
                <View key={index} style={styles.recommendationItem}>
                  <Icon 
                    name={resultado.status === 'dangerous' ? 'alert-octagon' : 'lightbulb-on'} 
                    size={18} 
                    color={resultado.status === 'dangerous' ? '#F44336' : '#4CAF50'} 
                  />
                  <Text style={[styles.recommendationText, { color: colors.onSurface }]}>
                    {rec}
                  </Text>
                </View>
              ))}
            </View>

            {/* Botón de reportar */}
            {resultado.status !== 'safe' && (
              <Button
                mode="contained"
                buttonColor="#D32F2F"
                onPress={handleReportar}
                disabled={isReporting}
                style={styles.reportButton}
                contentStyle={styles.buttonContent}
                icon="flag"
              >
                {isReporting ? 'Reportando...' : 'Reportar Mensaje'}
              </Button>
            )}

            <Text 
              variant="bodySmall" 
              style={[styles.timestamp, { color: colors.onSurfaceVariant }]}
            >
              Análisis realizado: {resultado.timestamp.toLocaleString('es-PE')}
            </Text>
          </Card.Content>
        </Card>
      )}

      {/* Tips de uso */}
      {!resultado && !isAnalyzing && (
        <Card style={styles.card} mode="outlined">
          <Card.Content>
            <View style={styles.tipsHeader}>
              <Icon name="information" size={24} color={colors.primary} />
              <Text variant="titleMedium" style={[styles.tipsTitle, { color: colors.onSurface }]}>
                Consejos de Seguridad
              </Text>
            </View>
            <View style={styles.tipsList}>
              <Text style={{ color: colors.onSurfaceVariant }}>
                • Nunca compartas contraseñas por mensaje{'\n'}
                • Verifica remitentes desconocidos{'\n'}
                • Desconfía de urgencias exageradas{'\n'}
                • No hagas clic en enlaces sospechosos
              </Text>
            </View>
          </Card.Content>
        </Card>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    gap: 16,
    paddingBottom: 32,
  },
  card: {
    borderRadius: 16,
    elevation: 2,
  },
  headerWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  cardTitle: {
    fontWeight: 'bold',
  },
  description: {
    marginBottom: 16,
    lineHeight: 20,
  },
  textArea: {
    minHeight: 120,
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    textAlignVertical: 'top',
    fontSize: 14,
    lineHeight: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    borderRadius: 12,
  },
  secondaryButton: {
    borderRadius: 12,
  },
  buttonContent: {
    paddingVertical: 6,
  },
  loadingCard: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusTextContainer: {
    gap: 2,
  },
  statusText: {
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  riskChip: {
    borderWidth: 2,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    marginBottom: 12,
    fontWeight: 'bold',
  },
  threatItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
    paddingLeft: 8,
  },
  threatText: {
    flex: 1,
    lineHeight: 22,
  },
  detailItem: {
    marginBottom: 12,
    paddingLeft: 8,
  },
  urlText: {
    fontSize: 12,
    fontFamily: 'monospace',
    marginTop: 4,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
    paddingLeft: 8,
  },
  recommendationText: {
    flex: 1,
    lineHeight: 22,
  },
  reportButton: {
    marginTop: 8,
    borderRadius: 12,
  },
  timestamp: {
    marginTop: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  tipsTitle: {
    fontWeight: 'bold',
  },
  tipsList: {
    paddingLeft: 8,
  },
});

export default Analyze;