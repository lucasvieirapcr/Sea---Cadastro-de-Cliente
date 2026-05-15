package com.sea.clientes.dto;

import com.sea.clientes.model.TipoTelefone;

import java.util.List;

public class ClienteResponseDTO {

    private Long id;
    private String nome;
    private String cpf;
    private EnderecoResposta endereco;
    private List<TelefoneResposta> telefones;
    private List<EmailResposta> emails;

    public static class EnderecoResposta {
        private String cep;
        private String logradouro;
        private String bairro;
        private String cidade;
        private String uf;
        private String numero;
        private String complemento;

        public String getCep() { return cep; }
        public void setCep(String cep) { this.cep = cep; }
        public String getLogradouro() { return logradouro; }
        public void setLogradouro(String logradouro) { this.logradouro = logradouro; }
        public String getBairro() { return bairro; }
        public void setBairro(String bairro) { this.bairro = bairro; }
        public String getCidade() { return cidade; }
        public void setCidade(String cidade) { this.cidade = cidade; }
        public String getUf() { return uf; }
        public void setUf(String uf) { this.uf = uf; }
        public String getNumero() { return numero; }
        public void setNumero(String numero) { this.numero = numero; }
        public String getComplemento() { return complemento; }
        public void setComplemento(String complemento) { this.complemento = complemento; }
    }

    public static class TelefoneResposta {
        private Long id;
        private String numero;
        private TipoTelefone tipo;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getNumero() { return numero; }
        public void setNumero(String numero) { this.numero = numero; }
        public TipoTelefone getTipo() { return tipo; }
        public void setTipo(TipoTelefone tipo) { this.tipo = tipo; }
    }

    public static class EmailResposta {
        private Long id;
        private String endereco;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getEndereco() { return endereco; }
        public void setEndereco(String endereco) { this.endereco = endereco; }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }

    public EnderecoResposta getEndereco() { return endereco; }
    public void setEndereco(EnderecoResposta endereco) { this.endereco = endereco; }

    public List<TelefoneResposta> getTelefones() { return telefones; }
    public void setTelefones(List<TelefoneResposta> telefones) { this.telefones = telefones; }

    public List<EmailResposta> getEmails() { return emails; }
    public void setEmails(List<EmailResposta> emails) { this.emails = emails; }
}
