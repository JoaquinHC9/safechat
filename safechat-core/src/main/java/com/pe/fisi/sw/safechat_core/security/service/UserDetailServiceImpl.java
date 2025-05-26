package com.pe.fisi.sw.safechat_core.security.service;

import com.pe.fisi.sw.safechat_core.security.model.Usuario;
import com.pe.fisi.sw.safechat_core.security.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserDetailServiceImpl implements UserDetailsService {
    private final UsuarioRepository usuarioRepository;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado!"));
        List<SimpleGrantedAuthority> authorityList = new ArrayList<>();
        usuario
                .getRoles()
                .forEach(role ->
                        authorityList
                                .add(new SimpleGrantedAuthority("ROLE_".concat(role.getRolEnum().name()))));
        return new User(usuario.getEmail(),usuario.getPassword(),authorityList);
    }
}
