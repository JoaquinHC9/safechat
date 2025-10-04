package com.example.phishingapp.repository;

import com.example.phishingapp.model.MensajeReportado;
import com.example.phishingapp.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MensajeReportadoRepository extends JpaRepository<MensajeReportado, Long> {
    List<MensajeReportado> findByUsuario(Usuario usuario);
}
