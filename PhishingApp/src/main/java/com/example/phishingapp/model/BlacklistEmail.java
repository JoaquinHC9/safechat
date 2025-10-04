package com.example.phishingapp.model;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "blacklist_emails")
@Data
public class BlacklistEmail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idBlacklistEmail;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @Column(nullable = false, length = 150)
    private String emailSospechoso;

    private LocalDateTime fechaRegistro = LocalDateTime.now();

}
