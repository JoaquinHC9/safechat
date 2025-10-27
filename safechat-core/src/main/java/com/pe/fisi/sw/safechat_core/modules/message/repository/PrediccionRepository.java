package com.pe.fisi.sw.safechat_core.modules.message.repository;

import com.pe.fisi.sw.safechat_core.modules.message.model.Prediccion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PrediccionRepository extends JpaRepository<Prediccion, Long> {
}
