package com.sea.clientes.service;

import com.sea.clientes.dto.ViaCepResponseDTO;
import com.sea.clientes.exception.RegraDeNegocioException;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class ViaCepService {

    private static final String URL_VIA_CEP = "https://viacep.com.br/ws/{cep}/json/";

    private final RestTemplate restTemplate;

    public ViaCepService() {
        this.restTemplate = new RestTemplate();
    }

    public ViaCepResponseDTO consultarCep(String cep) {
        String cepSoNumeros = cep.replaceAll("[^0-9]", "");

        if (cepSoNumeros.length() != 8) {
            throw new RegraDeNegocioException("CEP inválido: deve ter 8 dígitos");
        }

        try {
            ViaCepResponseDTO resposta = restTemplate.getForObject(
                URL_VIA_CEP,
                ViaCepResponseDTO.class,
                cepSoNumeros
            );

            if (resposta == null || resposta.cepNaoEncontrado()) {
                throw new RegraDeNegocioException("CEP não encontrado: " + cep);
            }

            return resposta;

        } catch (RegraDeNegocioException e) {
            throw e;
        } catch (Exception e) {
            throw new RegraDeNegocioException("Erro ao consultar o ViaCEP: " + e.getMessage());
        }
    }
}
