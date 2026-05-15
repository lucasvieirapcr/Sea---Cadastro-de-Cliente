package com.sea.clientes.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ViaCepResponseDTO {

    private String cep;
    private String logradouro;
    private String complemento;
    private String bairro;

    @JsonProperty("localidade")
    private String cidade;

    private String uf;

    @JsonProperty("erro")
    private String erro;

    // Método auxiliar para verificar se o CEP foi encontrado
    public boolean cepNaoEncontrado() {
        return "true".equals(erro);
    }

    public String getCep() { return cep; }
    public void setCep(String cep) { this.cep = cep; }

    public String getLogradouro() { return logradouro; }
    public void setLogradouro(String logradouro) { this.logradouro = logradouro; }

    public String getComplemento() { return complemento; }
    public void setComplemento(String complemento) { this.complemento = complemento; }

    public String getBairro() { return bairro; }
    public void setBairro(String bairro) { this.bairro = bairro; }

    public String getCidade() { return cidade; }
    public void setCidade(String cidade) { this.cidade = cidade; }

    public String getUf() { return uf; }
    public void setUf(String uf) { this.uf = uf; }

    public String getErro() { return erro; }
    public void setErro(String erro) { this.erro = erro; }
}
