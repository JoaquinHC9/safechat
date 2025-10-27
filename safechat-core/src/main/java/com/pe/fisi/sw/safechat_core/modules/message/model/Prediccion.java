package com.pe.fisi.sw.safechat_core.modules.message.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "predicciones")
@Data
public class Prediccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_prediccion")
    private Long idPrediccion;

    @ManyToOne
    @JoinColumn(name = "id_mensaje", referencedColumnName = "id_mensaje", nullable = false)
    private Mensaje mensaje;

    @ManyToOne
    @JoinColumn(name = "id_modelo", referencedColumnName = "id_modelo", nullable = false)
    private ModeloIA modelo;

    @Column(name = "etiqueta_prediccion", nullable = false, length = 50)
    private String etiquetaPrediccion;

    @Column(name = "confianza", precision = 5, scale = 2)
    private Float confianza;

    @Column(name = "analizado_en", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime analizadoEn;
}
