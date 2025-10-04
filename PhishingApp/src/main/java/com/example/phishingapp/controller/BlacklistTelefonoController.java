package com.example.phishingapp.controller;

import com.example.phishingapp.dto.BlacklistTelefonoDTO;
import com.example.phishingapp.model.BlacklistTelefono;
import com.example.phishingapp.service.BlacklistTelefonoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/blacklist/telefonos")
public class BlacklistTelefonoController {

    private final BlacklistTelefonoService service;

    public BlacklistTelefonoController(BlacklistTelefonoService service) {
        this.service = service;
    }

    @PostMapping("/agregar")
    public ResponseEntity<BlacklistTelefono> agregar(@RequestBody BlacklistTelefonoDTO dto) {
        return ResponseEntity.ok(service.agregarTelefono(dto));
    }

    @GetMapping("/listar/{idUsuario}")
    public ResponseEntity<List<BlacklistTelefono>> listar(@PathVariable Long idUsuario) {
        return ResponseEntity.ok(service.listarTelefonos(idUsuario));
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.eliminarTelefono(id);
        return ResponseEntity.noContent().build();
    }
}
