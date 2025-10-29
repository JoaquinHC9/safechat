package com.pe.fisi.sw.safechat_core.security.service;

import com.pe.fisi.sw.safechat_core.security.dto.ForgotPasswordRequest;
import com.pe.fisi.sw.safechat_core.security.dto.LoginRequest;
import com.pe.fisi.sw.safechat_core.security.dto.RegisterRequest;
import com.pe.fisi.sw.safechat_core.security.dto.TokenResponse;

import com.pe.fisi.sw.safechat_core.security.exception.CustomException;
import com.pe.fisi.sw.safechat_core.security.jwt.JwtProvider;
import com.pe.fisi.sw.safechat_core.security.model.Rol;
import com.pe.fisi.sw.safechat_core.security.model.Usuario;
import com.pe.fisi.sw.safechat_core.security.repository.UsuarioRepository;
import com.pe.fisi.sw.safechat_core.security.utils.RolEnum;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class UsuarioService {
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserDetailsService userDetailsService;
    private final JwtProvider jwtProvider;
    public TokenResponse register(RegisterRequest request) {
        if (request==null) {
            throw new IllegalArgumentException("Hubo un error al registrar el usuario");
        }
        boolean existe = usuarioRepository.findByEmail(request.getEmail()).isPresent();
        if (existe) {
            throw new CustomException("El email solicitado ya existe!", HttpStatus.CONFLICT);
        }
        Rol rolUsario = new Rol();
        rolUsario.setRolEnum(RolEnum.ROL_USUARIO);

        Usuario usuario = Usuario.builder()
                .nombre(request.getNombre())
                .apellido(request.getApellido())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .telefono(request.getTelefono())
                .fechaNacimiento(request.getFechaNacimiento())
                .roles(Collections.singleton(rolUsario))
                .build();
        usuarioRepository.save(usuario);
        return jwtProvider.generateToken(request.getEmail());
    }
    public TokenResponse login(LoginRequest request) {
        String email = request.getEmail();
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("El usuario no existe"));
        String contra = request.getPassword();
        Authentication authentication = this.authenticate(email, contra);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Generar y devolver el token
        return jwtProvider.generateToken(email);
    }

    public Authentication authenticate(String username, String password) {
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        if (!passwordEncoder.matches(password, userDetails.getPassword())) {
            throw new CustomException("La contraseña es incorrecta",HttpStatus.BAD_REQUEST);
        }
        return new UsernamePasswordAuthenticationToken(username, password, userDetails.getAuthorities());
    }

    public void actualizarPassword(ForgotPasswordRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new CustomException("El usuario no existe", HttpStatus.NOT_FOUND));

        usuario.setPassword(passwordEncoder.encode(request.getNuevaPassword()));
        usuarioRepository.save(usuario);
    }
}