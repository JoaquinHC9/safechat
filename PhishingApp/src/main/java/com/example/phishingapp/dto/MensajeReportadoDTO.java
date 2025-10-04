package com.example.phishingapp.dto;

import lombok.Data;

@Data
public class MensajeReportadoDTO {
    private Long idUsuario;
    private String contenido;
    private Integer label;
    private String tipoDiagnostico;
}
