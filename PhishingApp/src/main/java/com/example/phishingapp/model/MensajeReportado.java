package com.example.phishingapp.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "mensajes_reportados")
@Data
public class MensajeReportado {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idMensaje;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String contenido;

    @Column(nullable = false)
    private Integer label;

    @Column(nullable = false, length = 20)
    private String tipoDiagnostico;

    private LocalDateTime fechaReporte = LocalDateTime.now();

}
