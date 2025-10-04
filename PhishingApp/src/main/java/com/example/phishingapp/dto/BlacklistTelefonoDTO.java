package com.example.phishingapp.dto;

import lombok.Data;

@Data
public class BlacklistTelefonoDTO {
    private Long idUsuario;
    private String telefonoSospechoso;
}
