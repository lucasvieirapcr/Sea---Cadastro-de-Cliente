package com.sea.clientes.controller;

import com.sea.clientes.dto.LoginRequestDTO;
import com.sea.clientes.dto.LoginResponseDTO;
import com.sea.clientes.model.Usuario;
import com.sea.clientes.repository.UsuarioRepository;
import com.sea.clientes.security.GerenciadorJwt;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager gerenciadorDeAutenticacao;
    private final GerenciadorJwt gerenciadorJwt;
    private final UsuarioRepository usuarioRepository;
    public AuthController(
            AuthenticationManager gerenciadorDeAutenticacao,
            GerenciadorJwt gerenciadorJwt,
            UsuarioRepository usuarioRepository) {
        this.gerenciadorDeAutenticacao = gerenciadorDeAutenticacao;
        this.gerenciadorJwt = gerenciadorJwt;
        this.usuarioRepository = usuarioRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO dadosLogin) {
        Authentication autenticacao = gerenciadorDeAutenticacao.authenticate(
            new UsernamePasswordAuthenticationToken(
                dadosLogin.getUsername(),
                dadosLogin.getSenha()
            )
        );

        Optional<Usuario> usuarioOpcional = usuarioRepository.findByUsername(dadosLogin.getUsername());
        Usuario usuario = usuarioOpcional.get();

        String token = gerenciadorJwt.gerarToken(usuario.getUsername(), usuario.getPapel());

        return ResponseEntity.ok(
            new LoginResponseDTO(token, usuario.getPapel(), usuario.getUsername())
        );
    }
}
