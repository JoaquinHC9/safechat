package com.example.phishingapp.repository;

import com.example.phishingapp.model.BlacklistTelefono;
import com.example.phishingapp.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BlacklistTelefonoRepository extends JpaRepository<BlacklistTelefono, Long> {
    List<BlacklistTelefono> findByUsuario(Usuario usuario);
}
