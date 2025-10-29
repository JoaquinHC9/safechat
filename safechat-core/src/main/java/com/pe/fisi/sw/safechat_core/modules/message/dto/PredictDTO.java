package com.pe.fisi.sw.safechat_core.modules.message.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;

@Data
@RequiredArgsConstructor
@AllArgsConstructor
public class PredictDTO {
    private String modelo;
    private String prediccion;
    private BigDecimal confianza;
}
