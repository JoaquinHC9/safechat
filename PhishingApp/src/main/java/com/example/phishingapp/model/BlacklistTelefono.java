package com.example.phishingapp.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "blacklist_telefonos")
@Data

public class BlacklistTelefono {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idBlacklistTel;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @Column(nullable = false, length = 20)
    private String telefonoSospechoso;

    private LocalDateTime fechaRegistro = LocalDateTime.now();
}
