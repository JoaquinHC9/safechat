package com.pe.fisi.sw.safechat_core.modules.blacklist.controller;

import com.pe.fisi.sw.safechat_core.modules.blacklist.dto.BlackListDTO;
import com.pe.fisi.sw.safechat_core.modules.blacklist.model.ListaNegra;
import com.pe.fisi.sw.safechat_core.modules.blacklist.service.BlackListService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/lista-negra")
@RequiredArgsConstructor
public class BlackListController {
    private final BlackListService listaNegraService;

    @PostMapping("/agregar")
    public ResponseEntity<?> agregarABlacklist(@RequestBody BlackListDTO request) {
        try {
            ListaNegra registro = listaNegraService.agregarABlacklist(
                    request.getIdUsuario(),
                    request.getValor(),
                    request.getTipo(),
                    request.getMotivo()
            );
            return ResponseEntity.ok(registro);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
