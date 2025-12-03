package com.pe.fisi.sw.safechat_core.modules.blacklist.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ListaNegraResponse {
    private Integer idListaNegra;
    private String valor;
    private String tipo;
    private String motivo;
    private String creadoEn;
    private Double reputacion;
}
