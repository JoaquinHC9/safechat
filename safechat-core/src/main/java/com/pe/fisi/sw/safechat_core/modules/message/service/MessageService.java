package com.pe.fisi.sw.safechat_core.modules.message.service;

import com.pe.fisi.sw.safechat_core.modules.message.config.FastApiClient;
import com.pe.fisi.sw.safechat_core.modules.message.dto.MensajeDTO;
import com.pe.fisi.sw.safechat_core.modules.message.dto.PredictDTO;
import com.pe.fisi.sw.safechat_core.modules.message.mapper.MensajeMapper;
import com.pe.fisi.sw.safechat_core.modules.message.model.Mensaje;
import com.pe.fisi.sw.safechat_core.modules.message.model.Prediccion;
import com.pe.fisi.sw.safechat_core.modules.message.repository.MensajeRepository;
import com.pe.fisi.sw.safechat_core.modules.message.repository.PrediccionRepository;
import com.pe.fisi.sw.safechat_core.security.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class MessageService {
    private final UsuarioRepository usuarioRepo;
    private final MensajeRepository mensajeRepo;
    private final PrediccionRepository prediccionRepo;

    private final MensajeMapper mensajeMapper;

    private final FastApiClient fastApiClient;



    public PredictDTO predecirMensaje(MensajeDTO dto) {
        Mensaje mensaje = new Mensaje();
        mensaje.setUsuario(usuarioRepo.findById(dto.getUserId()).orElseThrow());
        mensaje.setTipoMensaje(dto.getTipo());
        mensaje.setContenido(dto.getContenido());
        mensaje.setFuente(dto.getFuente());
        mensaje.setRemitente(dto.getRemitente());
        mensaje = mensajeRepo.save(mensaje);

        // Llamar a FastAPI
        PredictDTO predict = fastApiClient.predict(mensajeMapper.toMensajeDTO(mensaje));

        // Guardar predicción
        Prediccion p = new Prediccion();
        p.setMensaje(mensaje);
        p.setEtiquetaPrediccion(predict.getPrediccion());
        p.setConfianza(predict.getConfianza());
        p.setAnalizadoEn(LocalDateTime.now());

        prediccionRepo.save(p);
        return predict;
    }


    public MensajeDTO marcarComoSospechoso(MensajeDTO dto) {
        return null;
    }

    public MensajeDTO marcarNoSospechoso(MensajeDTO dto) {
        return null;
    }
}
