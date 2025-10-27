package com.pe.fisi.sw.safechat_core.modules.blacklist.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BlackListDTO {
    private Long idUsuario;
    private String valor;  // email o número
    private String tipo;   // "correo" o "telefono"
    private String motivo;
}
