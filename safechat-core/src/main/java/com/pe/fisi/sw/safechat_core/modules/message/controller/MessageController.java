package com.pe.fisi.sw.safechat_core.modules.message.controller;

import com.pe.fisi.sw.safechat_core.modules.message.dto.MensajeDTO;
import com.pe.fisi.sw.safechat_core.modules.message.dto.PredictDTO;
import com.pe.fisi.sw.safechat_core.modules.message.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/mensajes")
@RequiredArgsConstructor
public class MessageController {
    private final MessageService service;

    @PostMapping("/predecir")
    public ResponseEntity<PredictDTO> predictMessage(@RequestBody MensajeDTO dto) {
        return new ResponseEntity<>(service.predecirMensaje(dto), HttpStatus.OK);
    }
    @PostMapping("/marcar/sospechoso")
    public ResponseEntity<MensajeDTO> marcarPosiblePhishing(@RequestBody MensajeDTO dto) {
        return new ResponseEntity<>(service.marcarComoSospechoso(dto),HttpStatus.OK);
    }
    @PostMapping("/marcar/no-sospechoso")
    public ResponseEntity<MensajeDTO> marcarNoPhishing(@RequestBody MensajeDTO dto) {
        return new ResponseEntity<>(service.marcarNoSospechoso(dto),HttpStatus.OK);
    }
}
