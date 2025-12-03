package com.pe.fisi.sw.safechat_core.security.jwt;
import com.pe.fisi.sw.safechat_core.security.dto.TokenResponse;
import com.pe.fisi.sw.safechat_core.security.repository.UsuarioRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
@RequiredArgsConstructor
@Component
@Data
public class JwtProvider {
    private final UsuarioRepository userRepository;
    @Value("${jwt.secret}")
    private String privateKey;
    @Value("${jwt.expiration}")
    private long expiration;

    private final UsuarioRepository usuarioRepository;

    public TokenResponse generateToken(String email) {
        Map<String, Object> claims = new HashMap<>();

        Integer userId = usuarioRepository.findUsuarioByEmail(email).getIdUsuario();
        claims.put("userId", userId);

        String token = Jwts.builder()
                .claims(claims)
                .subject(email)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expiration * 1000))
                .signWith(getSignKey())
                .compact();

        return new TokenResponse(token);
    }
    private SecretKey getSignKey(){
        byte[] keyBytes  = Decoders.BASE64.decode(privateKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimResolver){
        final Claims claims = extractAllClaims(token);
        return claimResolver.apply(claims);
    }

    public String extractEmail(String token){
        return extractClaim(token, Claims::getSubject);
    }
    private Claims extractAllClaims(String token){
        return  Jwts.parser()
                .verifyWith(getSignKey())
                .build()
                .parseSignedClaims(token).getPayload();
    }
    public boolean validateToken(String token, UserDetails userDetails) {
        final String email = extractEmail(token);
        return (email.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }
}
