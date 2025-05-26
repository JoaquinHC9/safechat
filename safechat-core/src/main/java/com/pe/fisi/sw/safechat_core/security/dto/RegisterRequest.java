package com.pe.fisi.sw.safechat_core.security.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Date;

@Data
@AllArgsConstructor
public class RegisterRequest {
    @NotNull(message = "Usuario debe tener un nombre")
    private String nombre;
    @NotNull(message = "Usuario debe tener un apellido")
    private String apellido;
    @NotNull(message = "Usuario debe tener un email")
    private String email;
    @NotNull(message = "Usuario debe tener un contrasena")
    private String password;
    @NotNull(message = "Usuario debe tener un telefono")
    private String telefono;
    @NotNull(message = "Usuario debe colocar su fecha de nacimiento")
    private Date fechaNacimiento;
}
