package com.pe.fisi.sw.safechat_core.modules.message.repository;

import com.pe.fisi.sw.safechat_core.modules.message.model.Mensaje;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MensajeRepository extends JpaRepository<Mensaje, Long> {
}
