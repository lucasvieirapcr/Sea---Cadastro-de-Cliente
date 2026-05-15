package com.sea.clientes.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class GerenciadorJwt {

    @Value("${app.jwt.secret}")
    private String chaveSecreta;

    @Value("${app.jwt.expiracao}")
    private long tempoDeExpiracao; // em milissegundos

    private Key getChaveDeAssinatura() {
        return Keys.hmacShaKeyFor(chaveSecreta.getBytes());
    }

    public String gerarToken(String username, String papel) {
        Date agora = new Date();
        Date expiracao = new Date(agora.getTime() + tempoDeExpiracao);

        return Jwts.builder()
                .setSubject(username)
                .claim("papel", papel)
                .setIssuedAt(agora)
                .setExpiration(expiracao)
                .signWith(getChaveDeAssinatura(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String extrairUsername(String token) {
        return lerConteudo(token).getSubject();
    }

    public String extrairPapel(String token) {
        return (String) lerConteudo(token).get("papel");
    }

    public boolean tokenValido(String token, String username) {
        String usernameDoToken = extrairUsername(token);
        Date expiracao = lerConteudo(token).getExpiration();
        boolean naoExpirou = expiracao.after(new Date());

        return usernameDoToken.equals(username) && naoExpirou;
    }

    private Claims lerConteudo(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getChaveDeAssinatura())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
