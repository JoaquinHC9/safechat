package com.pe.fisi.sw.safechat_core.modules.blacklist.service;

import com.pe.fisi.sw.safechat_core.modules.blacklist.model.Atacante;
import com.pe.fisi.sw.safechat_core.modules.blacklist.model.ListaNegra;
import com.pe.fisi.sw.safechat_core.modules.blacklist.repository.AtacanteRepository;
import com.pe.fisi.sw.safechat_core.modules.blacklist.repository.ListaNegraRepository;
import com.pe.fisi.sw.safechat_core.security.exception.CustomException;
import com.pe.fisi.sw.safechat_core.security.model.Usuario;
import com.pe.fisi.sw.safechat_core.security.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BlackListService {

    private final AtacanteRepository atacanteRepo;
    private final ListaNegraRepository listaNegraRepo;
    private final UsuarioRepository usuarioRepo;


    public ListaNegra agregarABlacklist(Integer idUsuario, String valor, String tipo, String motivo) {
        Usuario usuario = usuarioRepo.findById(idUsuario)
                .orElseThrow(() -> new CustomException("Usuario no encontrado",HttpStatus.NOT_FOUND));

        Atacante atacante = atacanteRepo.findByValor(valor)
                .orElseGet(() -> {
                    Atacante nuevo = new Atacante();
                    nuevo.setValor(valor);
                    nuevo.setTipo(tipo);
                    return atacanteRepo.save(nuevo);
                });

        boolean existe = listaNegraRepo.existsByUsuarioIdUsuarioAndAtacanteIdAtacante(usuario.getIdUsuario(), atacante.getIdAtacante());
        if (existe) {
            throw new CustomException("El atacante ya está en la lista negra de este usuario", HttpStatus.CONFLICT);
        }

        ListaNegra entrada = new ListaNegra();
        entrada.setUsuario(usuario);
        entrada.setAtacante(atacante);
        entrada.setMotivo(motivo);

        return listaNegraRepo.save(entrada);
    }
}
