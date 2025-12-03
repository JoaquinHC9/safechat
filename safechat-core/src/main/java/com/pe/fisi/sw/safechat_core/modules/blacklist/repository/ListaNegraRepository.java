package com.pe.fisi.sw.safechat_core.modules.blacklist.repository;

import com.pe.fisi.sw.safechat_core.modules.blacklist.model.ListaNegra;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ListaNegraRepository extends JpaRepository<ListaNegra, Integer> {
    boolean existsByUsuarioIdUsuarioAndAtacanteIdAtacante(Integer idUsuario, Integer idAtacante);
}
