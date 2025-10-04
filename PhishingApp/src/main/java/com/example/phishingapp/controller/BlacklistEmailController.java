package com.example.phishingapp.controller;

import com.example.phishingapp.dto.BlacklistEmailDTO;
import com.example.phishingapp.model.BlacklistEmail;
import com.example.phishingapp.service.BlacklistEmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/blacklist/emails")
public class BlacklistEmailController {

    private final BlacklistEmailService service;

    public BlacklistEmailController(BlacklistEmailService service) {
        this.service = service;
    }

    @PostMapping("/registrarEmail")
    public ResponseEntity<BlacklistEmail> agregar(@RequestBody BlacklistEmailDTO dto) {
        return ResponseEntity.ok(service.agregarEmail(dto));
    }

    @GetMapping("/obtenerEmails/{idUsuario}")
    public ResponseEntity<List<BlacklistEmail>> listar(@PathVariable Long idUsuario) {
        return ResponseEntity.ok(service.listarEmails(idUsuario));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.eliminarEmail(id);
        return ResponseEntity.noContent().build();
    }
}
