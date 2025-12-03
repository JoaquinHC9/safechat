package com.pe.fisi.sw.safechat_core.modules.blacklist.controller;

import com.pe.fisi.sw.safechat_core.modules.blacklist.dto.BlackListDTO;
import com.pe.fisi.sw.safechat_core.modules.blacklist.dto.ListaNegraResponse;
import com.pe.fisi.sw.safechat_core.modules.blacklist.model.ListaNegra;
import com.pe.fisi.sw.safechat_core.modules.blacklist.service.BlackListService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/lista-negra")
@RequiredArgsConstructor
public class BlackListController {

    private final BlackListService listaNegraService;

    @PostMapping("/agregar")
    public ResponseEntity<?> agregar(@RequestBody BlackListDTO request) {
        try {
            return ResponseEntity.ok(listaNegraService.agregarABlacklist(
                    request.getIdUsuario(),
                    request.getValor(),
                    request.getTipo(),
                    request.getMotivo()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<ListaNegraResponse>> listar(@PathVariable Integer idUsuario) {
        return ResponseEntity.ok(listaNegraService.obtenerListaNegraDTO(idUsuario));
    }

    @DeleteMapping("/{idListaNegra}")
    public ResponseEntity<?> eliminar(@PathVariable Integer idListaNegra) {
        try {
            listaNegraService.eliminarDeListaNegra(idListaNegra);
            return ResponseEntity.ok(Map.of("mensaje", "Eliminado correctamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/estadisticas/{idUsuario}")
    public ResponseEntity<?> estadisticas(@PathVariable Integer idUsuario) {
        return ResponseEntity.ok(listaNegraService.obtenerEstadisticas(idUsuario));
    }
    @GetMapping("/exportar/{idUsuario}")
    public ResponseEntity<?> exportar(@PathVariable Integer idUsuario) {
        try {
            String csv = listaNegraService.exportarListaNegra(idUsuario);
            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=\"blocklist.csv\"")
                    .body(csv);
        } catch (RuntimeException e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
    @PostMapping("/importar/{idUsuario}")
    public ResponseEntity<?> importar(@PathVariable Integer idUsuario, @RequestBody String csvData) {
        try {
            Map<String, Integer> resultado = listaNegraService.importarListaNegra(idUsuario, csvData);
            return ResponseEntity.ok(resultado);
        } catch (RuntimeException e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
    @GetMapping("/todos/{idUsuario}")
    public ResponseEntity<List<ListaNegraResponse>> listarTodos(@PathVariable Integer idUsuario) {
        return ResponseEntity.ok(listaNegraService.obtenerListaNegraDTO(idUsuario));
    }
}

