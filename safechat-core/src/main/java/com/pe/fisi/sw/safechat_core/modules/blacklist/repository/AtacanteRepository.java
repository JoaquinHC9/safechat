package com.pe.fisi.sw.safechat_core.modules.blacklist.repository;

import com.pe.fisi.sw.safechat_core.modules.blacklist.model.Atacante;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AtacanteRepository extends JpaRepository<Atacante,Integer> {
    Optional<Atacante> findByValor(String valor);
}
