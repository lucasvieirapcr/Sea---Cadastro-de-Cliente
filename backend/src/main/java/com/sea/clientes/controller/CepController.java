package com.sea.clientes.controller;

import com.sea.clientes.dto.ViaCepResponseDTO;
import com.sea.clientes.service.ViaCepService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cep")
public class CepController {

    private final ViaCepService viaCepService;

    public CepController(ViaCepService viaCepService) {
        this.viaCepService = viaCepService;
    }

    @GetMapping("/{cep}")
    public ResponseEntity<ViaCepResponseDTO> consultarCep(@PathVariable String cep) {
        ViaCepResponseDTO resposta = viaCepService.consultarCep(cep);
        return ResponseEntity.ok(resposta);
    }
}
