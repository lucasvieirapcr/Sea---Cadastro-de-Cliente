package com.sea.clientes.security;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collections;

@Component
public class FiltroJwt extends OncePerRequestFilter {

    private final GerenciadorJwt gerenciadorJwt;

    public FiltroJwt(GerenciadorJwt gerenciadorJwt) {
        this.gerenciadorJwt = gerenciadorJwt;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest requisicao,
            HttpServletResponse resposta,
            FilterChain proximoFiltro) throws ServletException, IOException {

        String headerAutorizacao = requisicao.getHeader("Authorization");

        if (headerAutorizacao == null || !headerAutorizacao.startsWith("Bearer ")) {
            proximoFiltro.doFilter(requisicao, resposta);
            return;
        }

        String token = headerAutorizacao.substring(7);

        try {
            String username = gerenciadorJwt.extrairUsername(token);
            String papel = gerenciadorJwt.extrairPapel(token);

            if (username != null && gerenciadorJwt.tokenValido(token, username)) {

                SimpleGrantedAuthority autoridade = new SimpleGrantedAuthority("ROLE_" + papel);

                UsernamePasswordAuthenticationToken autenticacao =
                        new UsernamePasswordAuthenticationToken(
                                username,
                                null,
                                Collections.singletonList(autoridade)
                        );

                SecurityContextHolder.getContext().setAuthentication(autenticacao);
            }

        } catch (Exception erro) {
            System.out.println("Token inválido: " + erro.getMessage());
        }

        proximoFiltro.doFilter(requisicao, resposta);
    }
}
