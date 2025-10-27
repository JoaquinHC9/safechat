package com.pe.fisi.sw.safechat_core.modules.blacklist.model;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;


@Entity
@Table(name = "atacante")
@Data
public class Atacante {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idAtacante;

    @Column(nullable = false, unique = true)
    private String valor; // correo, teléfono o dominio

    @Column(nullable = false)
    private String tipo; // "correo" o "telefono"

    private Double reputacion = 0.0;

    @Column(name = "creado_en")
    private LocalDateTime creadoEn = LocalDateTime.now();
}
