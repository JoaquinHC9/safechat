package com.pe.fisi.sw.safechat_core.security.handler;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class ErrorResponse {
    private int status;
    private String message;
}