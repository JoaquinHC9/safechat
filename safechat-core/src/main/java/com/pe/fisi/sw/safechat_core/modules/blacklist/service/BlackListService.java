package com.pe.fisi.sw.safechat_core.modules.blacklist.service;

import com.pe.fisi.sw.safechat_core.modules.blacklist.dto.BlackListDTO;
import com.pe.fisi.sw.safechat_core.modules.blacklist.dto.ListaNegraResponse;
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

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BlackListService {

    private final ListaNegraRepository listaNegraRepo;
    private final AtacanteRepository atacanteRepo;
    private final UsuarioRepository usuarioRepo;

    public ListaNegra agregarABlacklist(Integer idUsuario, String valor, String tipo, String motivo) {
        Usuario usuario = usuarioRepo.findById(idUsuario)
                .orElseThrow(() -> new CustomException("Usuario no encontrado", HttpStatus.NOT_FOUND));

        Atacante atacante = atacanteRepo.findByValor(valor)
                .orElseGet(() -> {
                    Atacante nuevo = new Atacante();
                    nuevo.setValor(valor);
                    nuevo.setTipo(tipo);
                    return atacanteRepo.save(nuevo);
                });

        if (listaNegraRepo.existsByUsuarioIdUsuarioAndAtacanteIdAtacante(usuario.getIdUsuario(), atacante.getIdAtacante())) {
            throw new CustomException("El atacante ya está en la lista negra", HttpStatus.CONFLICT);
        }

        ListaNegra entrada = new ListaNegra();
        entrada.setUsuario(usuario);
        entrada.setAtacante(atacante);
        entrada.setMotivo(motivo);

        return listaNegraRepo.save(entrada);
    }

    public List<ListaNegra> obtenerListaNegraPorUsuario(Integer idUsuario) {
        return listaNegraRepo.findAllByUsuarioIdUsuario(idUsuario);
    }

    public void eliminarDeListaNegra(Integer idListaNegra) {
        ListaNegra entrada = listaNegraRepo.findById(idListaNegra)
                .orElseThrow(() -> new CustomException("No existe la entrada en la lista negra", HttpStatus.NOT_FOUND));
        listaNegraRepo.delete(entrada);
    }

    public Map<String, Object> obtenerEstadisticas(Integer idUsuario) {
        List<ListaNegra> lista = listaNegraRepo.findAllByUsuarioIdUsuario(idUsuario);
        long hoy = lista.stream().filter(e -> e.getCreadoEn().toLocalDate().equals(LocalDate.now())).count();
        long semana = lista.stream().filter(e -> e.getCreadoEn().toLocalDate().isAfter(LocalDate.now().minusDays(7))).count();

        // Nivel de riesgo promedio (solo ejemplo, usando enum como string)
        Map<String, Integer> riesgoMap = Map.of("bajo", 1, "medio", 2, "alto", 3);
        double promedio = lista.stream()
                .mapToInt(e -> riesgoMap.getOrDefault(e.getAtacante().getTipo().toLowerCase(), 1))
                .average()
                .orElse(1.0);

        String nivelRiesgoPromedio = promedio < 1.5 ? "Bajo" : promedio < 2.5 ? "Medio" : "Alto";

        return Map.of(
                "total", lista.size(),
                "bloqueadosHoy", hoy,
                "bloqueadosEstaSemana", semana,
                "nivelRiesgoPromedio", nivelRiesgoPromedio
        );
    }
    public String exportarListaNegra(Integer idUsuario) {
        List<ListaNegra> lista = obtenerListaNegraPorUsuario(idUsuario);
        return "Número,Motivo,Fecha,Nivel de Riesgo\n" +
                lista.stream()
                        .map(l -> l.getAtacante().getValor() + "," + l.getMotivo() + "," + l.getCreadoEn() + "," + l.getAtacante().getTipo())
                        .collect(Collectors.joining("\n"));
    }

    public Map<String, Integer> importarListaNegra(Integer idUsuario, String csvData) {
        String[] lines = csvData.split("\n");
        int success = 0;
        int errors = 0;

        // Asumimos que la primera línea es el header
        for (int i = 1; i < lines.length; i++) {
            String line = lines[i].trim();
            if (line.isEmpty()) continue;

            try {
                // Separar por comas, respetando que algunas columnas pueden tener comillas
                String[] cols = line.split(",");

                if (cols.length < 3) { // mínimo valor, tipo, motivo
                    errors++;
                    continue;
                }

                String valor = cols[0].trim();
                String motivo = cols[1].trim();
                String tipo = cols[2].trim(); // "correo" o "telefono"

                agregarABlacklist(idUsuario, valor, tipo, motivo);
                success++;
            } catch (Exception e) {
                errors++;
            }
        }

        return Map.of("success", success, "errors", errors);
    }

    public List<ListaNegraResponse> obtenerListaNegraDTO(Integer idUsuario) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        return listaNegraRepo.findAllByUsuarioIdUsuario(idUsuario)
                .stream()
                .map(ln -> new ListaNegraResponse(
                        ln.getIdListaNegra(),
                        ln.getAtacante().getValor(),
                        ln.getAtacante().getTipo(),
                        ln.getMotivo(),
                        ln.getCreadoEn().format(formatter),
                        ln.getAtacante().getReputacion()
                ))
                .toList();
    }
}
