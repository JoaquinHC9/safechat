package com.pe.fisi.sw.safechat_core.modules.message.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MensajeDTO {
    private Long userId;
    private String tipo;
    private String contenido;
    private String fuente;
    private String remitente;
}
