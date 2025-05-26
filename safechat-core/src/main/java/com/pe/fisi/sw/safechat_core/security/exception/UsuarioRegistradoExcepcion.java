package com.pe.fisi.sw.safechat_core.security.exception;


import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
public class UsuarioRegistradoExcepcion extends RuntimeException {
    public UsuarioRegistradoExcepcion(String msg) {
        super(msg);
    }
}