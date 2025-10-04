package com.example.phishingapp.service;

import com.example.phishingapp.dto.BlacklistEmailDTO;
import com.example.phishingapp.model.BlacklistEmail;
import com.example.phishingapp.model.Usuario;
import com.example.phishingapp.repository.BlacklistEmailRepository;
import com.example.phishingapp.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BlacklistEmailService {

    private final BlacklistEmailRepository blacklistEmailRepo;
    private final UsuarioRepository usuarioRepo;

    public BlacklistEmailService(BlacklistEmailRepository blacklistEmailRepo, UsuarioRepository usuarioRepo) {
        this.blacklistEmailRepo = blacklistEmailRepo;
        this.usuarioRepo = usuarioRepo;
    }

    public BlacklistEmail agregarEmail(BlacklistEmailDTO dto) {
        Usuario usuario = usuarioRepo.findById(dto.getIdUsuario())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        BlacklistEmail email = new BlacklistEmail();
        email.setUsuario(usuario);
        email.setEmailSospechoso(dto.getEmailSospechoso());

        return blacklistEmailRepo.save(email);
    }

    public List<BlacklistEmail> listarEmails(Long idUsuario) {
        Usuario usuario = usuarioRepo.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return blacklistEmailRepo.findByUsuario(usuario);
    }

    public void eliminarEmail(Long id) {
        blacklistEmailRepo.deleteById(id);
    }
}
