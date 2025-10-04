package com.example.phishingapp.dto;

import lombok.Data;

@Data
public class BlacklistEmailDTO {
    private Long idUsuario;
    private String emailSospechoso;

}
