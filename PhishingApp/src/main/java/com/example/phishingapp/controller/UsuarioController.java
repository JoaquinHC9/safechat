package com.example.phishingapp.controller;

import com.example.phishingapp.dto.UsuarioDTO;
import com.example.phishingapp.model.Usuario;
import com.example.phishingapp.service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {
    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    // Registro
    @PostMapping("/registro")
    public ResponseEntity<Usuario> registrar(@RequestBody UsuarioDTO dto) {
        Usuario usuario = usuarioService.registrarUsuario(dto);
        return ResponseEntity.ok(usuario);
    }

    // Login simple
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UsuarioDTO dto) {
        Optional<Usuario> usuario = usuarioService.login(dto.getEmail(), dto.getPassword());
        if (usuario.isPresent()) {
            return ResponseEntity.ok(usuario.get());
        } else {
            return ResponseEntity.status(401).body("Credenciales inválidas");
        }
    }

    // Editar perfil
    @PutMapping("/{idUsuario}")
    public ResponseEntity<Usuario> editarPerfil(@PathVariable Long idUsuario, @RequestBody UsuarioDTO dto) {
        Usuario usuario = usuarioService.editarPerfil(idUsuario, dto);
        return ResponseEntity.ok(usuario);
    }
}
