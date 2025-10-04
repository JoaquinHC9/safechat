package com.example.phishingapp.controller;

import com.example.phishingapp.dto.MensajeReportadoDTO;
import com.example.phishingapp.model.MensajeReportado;
import com.example.phishingapp.service.MensajeReportadoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/mensajes")
public class MensajeReportadoController {
    private final MensajeReportadoService mensajeService;

    public MensajeReportadoController(MensajeReportadoService mensajeService) {
        this.mensajeService = mensajeService;
    }

    @PostMapping("/guardarMensaje")
    public ResponseEntity<MensajeReportado> guardarMensaje(@RequestBody MensajeReportadoDTO dto) {
        MensajeReportado mensaje = mensajeService.guardarMensaje(dto);
        return ResponseEntity.ok(mensaje);
    }

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<MensajeReportado>> listarMensajesUsuario(@PathVariable Long idUsuario) {
        return ResponseEntity.ok(mensajeService.listarPorUsuario(idUsuario));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MensajeReportado> obtenerMensaje(@PathVariable Long id) {
        return ResponseEntity.ok(mensajeService.obtenerPorId(id));
    }
}
