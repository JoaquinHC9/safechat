package com.pe.fisi.sw.safechat_core.modules.message.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
@AllArgsConstructor
public class PredictDTO {
    private String modelo;
    private String prediccion;
    private Float confianza;
}
