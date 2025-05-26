package com.pe.fisi.sw.safechat_core.security.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
@AllArgsConstructor
public class TokenResponse {
    public String token;
}
