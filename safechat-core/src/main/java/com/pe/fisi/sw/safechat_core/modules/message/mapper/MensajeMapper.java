package com.pe.fisi.sw.safechat_core.modules.message.mapper;

import com.pe.fisi.sw.safechat_core.modules.message.dto.MensajeDTO;
import com.pe.fisi.sw.safechat_core.modules.message.model.Mensaje;
import org.springframework.stereotype.Component;

@Component
public class MensajeMapper {

    public MensajeDTO toMensajeDTO(Mensaje mensaje) {
        MensajeDTO mensajeDTO = new MensajeDTO();
        mensajeDTO.setContenido(mensaje.getContenido());
        mensajeDTO.setFuente(mensaje.getFuente());
        mensajeDTO.setTipo(mensajeDTO.getTipo());
        mensajeDTO.setRemitente(mensaje.getRemitente());
        mensajeDTO.setUserId(mensaje.getUsuario().getIdUsuario());
        return mensajeDTO;
    }
}
