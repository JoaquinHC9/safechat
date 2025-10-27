package com.pe.fisi.sw.safechat_core.modules.message.model;

import com.pe.fisi.sw.safechat_core.security.model.Usuario;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "mensajes")
@Data
public class Mensaje {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_mensaje")
    private Long idMensaje;

    @ManyToOne
    @JoinColumn(name = "id_usuario", referencedColumnName = "id_usuario", nullable = true)
    private Usuario usuario;

    @Column(name = "contenido", nullable = false, columnDefinition = "TEXT")
    private String contenido;

    @Column(name = "tipo_mensaje", length = 50)
    private String tipoMensaje = "SMS";

    @Column(name = "origen", length = 100)
    private String fuente;

    @Column(name = "estado", length = 50)
    private String estado = "pendiente";

    @Column(name = "recibido_en", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime recibidoEn;
    @Column(length = 150)
    private String remitente;

}