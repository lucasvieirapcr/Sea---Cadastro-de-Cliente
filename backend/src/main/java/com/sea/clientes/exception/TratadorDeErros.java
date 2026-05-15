package com.sea.clientes.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class TratadorDeErros {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> tratarErroDeValidacao(
            MethodArgumentNotValidException excecao) {

        Map<String, String> errosDoCampos = new HashMap<>();
        for (FieldError erro : excecao.getBindingResult().getFieldErrors()) {
            errosDoCampos.put(erro.getField(), erro.getDefaultMessage());
        }

        Map<String, Object> resposta = criarResposta(400, "Erro de validação dos campos");
        resposta.put("erros", errosDoCampos);

        return ResponseEntity.badRequest().body(resposta);
    }

    @ExceptionHandler(RegraDeNegocioException.class)
    public ResponseEntity<Map<String, Object>> tratarRegraDeNegocio(
            RegraDeNegocioException excecao) {
        return ResponseEntity
                .badRequest()
                .body(criarResposta(400, excecao.getMessage()));
    }

    @ExceptionHandler(RecursoNaoEncontradoException.class)
    public ResponseEntity<Map<String, Object>> tratarNaoEncontrado(
            RecursoNaoEncontradoException excecao) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND) // HTTP 404
                .body(criarResposta(404, excecao.getMessage()));
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, Object>> tratarSenhaErrada(
            BadCredentialsException excecao) {
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED) // HTTP 401
                .body(criarResposta(401, "Usuário ou senha incorretos"));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, Object>> tratarAcessoNegado(
            AccessDeniedException excecao) {
        return ResponseEntity
                .status(HttpStatus.FORBIDDEN) // HTTP 403
                .body(criarResposta(403, "Acesso negado. Você não tem permissão para essa operação."));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> tratarErroGenerico(Exception excecao) {
        System.err.println("Erro inesperado: " + excecao.getMessage());
        excecao.printStackTrace();

        return ResponseEntity
                .internalServerError() // HTTP 500
                .body(criarResposta(500, "Ocorreu um erro interno no servidor. Tente novamente."));
    }

    private Map<String, Object> criarResposta(int status, String mensagem) {
        Map<String, Object> resposta = new HashMap<>();
        resposta.put("timestamp", LocalDateTime.now().toString());
        resposta.put("status", status);
        resposta.put("mensagem", mensagem);
        return resposta;
    }
}
