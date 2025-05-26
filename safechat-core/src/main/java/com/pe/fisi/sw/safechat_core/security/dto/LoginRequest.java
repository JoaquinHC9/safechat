package com.pe.fisi.sw.safechat_core.security.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginRequest {
    @NotNull(message = "Usuario debe tener un email")
    private String email;
    @NotNull(message = "Usuario debe tener un contrasena")
    private String password;
}
