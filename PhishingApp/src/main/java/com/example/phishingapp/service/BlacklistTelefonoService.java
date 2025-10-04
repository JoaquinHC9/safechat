package com.example.phishingapp.service;

import com.example.phishingapp.dto.BlacklistTelefonoDTO;
import com.example.phishingapp.model.BlacklistTelefono;
import com.example.phishingapp.model.Usuario;
import com.example.phishingapp.repository.BlacklistTelefonoRepository;
import com.example.phishingapp.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BlacklistTelefonoService {

    private final BlacklistTelefonoRepository blacklistTelefonoRepo;
    private final UsuarioRepository usuarioRepo;

    public BlacklistTelefonoService(BlacklistTelefonoRepository blacklistTelefonoRepo, UsuarioRepository usuarioRepo) {
        this.blacklistTelefonoRepo = blacklistTelefonoRepo;
        this.usuarioRepo = usuarioRepo;
    }

    public BlacklistTelefono agregarTelefono(BlacklistTelefonoDTO dto) {
        Usuario usuario = usuarioRepo.findById(dto.getIdUsuario())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        BlacklistTelefono telefono = new BlacklistTelefono();
        telefono.setUsuario(usuario);
        telefono.setTelefonoSospechoso(dto.getTelefonoSospechoso());

        return blacklistTelefonoRepo.save(telefono);
    }

    public List<BlacklistTelefono> listarTelefonos(Long idUsuario) {
        Usuario usuario = usuarioRepo.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return blacklistTelefonoRepo.findByUsuario(usuario);
    }

    public void eliminarTelefono(Long id) {
        blacklistTelefonoRepo.deleteById(id);
    }
}
