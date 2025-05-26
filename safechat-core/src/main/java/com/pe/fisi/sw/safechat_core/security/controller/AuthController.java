package com.pe.fisi.sw.safechat_core.security.controller;

import com.pe.fisi.sw.safechat_core.security.dto.LoginRequest;
import com.pe.fisi.sw.safechat_core.security.dto.RegisterRequest;
import com.pe.fisi.sw.safechat_core.security.dto.TokenResponse;
import com.pe.fisi.sw.safechat_core.security.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RequiredArgsConstructor
@RequestMapping("/v1/auth")
@RestController
@CrossOrigin("*")
public class AuthController {
    private final UsuarioService usuarioService;
    @PostMapping("/register")
    public ResponseEntity<TokenResponse> register(@RequestBody @Valid RegisterRequest userRequest) {
        return new ResponseEntity<>(usuarioService.register(userRequest), HttpStatus.CREATED);
    }
    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@RequestBody @Valid LoginRequest userRequest) {
        return new ResponseEntity<>(usuarioService.login(userRequest), HttpStatus.OK);
    }
}