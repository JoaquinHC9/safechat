package com.pe.fisi.sw.safechat_core.modules.blacklist.model;

import com.pe.fisi.sw.safechat_core.security.model.Usuario;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "lista_negra", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"id_usuario", "id_atacante"})
})
@Data
public class ListaNegra {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idListaNegra;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_atacante", nullable = false)
    private Atacante atacante;

    private String motivo;

    @Column(name = "creado_en")
    private LocalDateTime creadoEn = LocalDateTime.now();
}
