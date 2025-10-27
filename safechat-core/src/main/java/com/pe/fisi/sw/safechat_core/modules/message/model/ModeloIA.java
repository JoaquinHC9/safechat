package com.pe.fisi.sw.safechat_core.modules.message.model;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "modelos")
@Data
public class ModeloIA {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_modelo")
    private Long idModelo;

    @Column(name = "nombre_modelo", nullable = false, length = 100)
    private String nombreModelo;

    @Column(name = "version", length = 50)
    private String version;

    @Column(name = "precision", precision = 5, scale = 2)
    private Double precision;

    @Column(name = "f1_score", precision = 5, scale = 2)
    private Double f1Score;

    @Column(name = "creado_en", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime creadoEn;

    // Relación con predicciones (uno a muchos)
    @OneToMany(mappedBy = "modelo", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Prediccion> predicciones;
}
