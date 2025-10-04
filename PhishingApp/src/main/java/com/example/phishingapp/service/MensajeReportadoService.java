package com.example.phishingapp.service;

import com.example.phishingapp.dto.MensajeReportadoDTO;
import com.example.phishingapp.model.MensajeReportado;
import com.example.phishingapp.model.Usuario;
import com.example.phishingapp.repository.MensajeReportadoRepository;
import com.example.phishingapp.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MensajeReportadoService {

    private final MensajeReportadoRepository mensajeRepo;
    private final UsuarioRepository usuarioRepo;

    public MensajeReportadoService(MensajeReportadoRepository mensajeRepo, UsuarioRepository usuarioRepo) {
        this.mensajeRepo = mensajeRepo;
        this.usuarioRepo = usuarioRepo;
    }

    public MensajeReportado guardarMensaje(MensajeReportadoDTO dto) {
        Usuario usuario = usuarioRepo.findById(dto.getIdUsuario())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        MensajeReportado mensaje = new MensajeReportado();
        mensaje.setUsuario(usuario);
        mensaje.setContenido(dto.getContenido());
        mensaje.setLabel(dto.getLabel());
        mensaje.setTipoDiagnostico(dto.getTipoDiagnostico());

        return mensajeRepo.save(mensaje);
    }

    public List<MensajeReportado> listarPorUsuario(Long idUsuario) {
        Usuario usuario = usuarioRepo.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return mensajeRepo.findByUsuario(usuario);
    }

    public MensajeReportado obtenerPorId(Long idMensaje) {
        return mensajeRepo.findById(idMensaje)
                .orElseThrow(() -> new RuntimeException("Mensaje no encontrado"));
    }
}
