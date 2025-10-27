package com.pe.fisi.sw.safechat_core.security.repository;

import com.pe.fisi.sw.safechat_core.security.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario,Long> {
    Optional<Usuario> findByEmail(String email);
    Usuario findUsuarioByEmail(String email);
}
