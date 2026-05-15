package com.sea.clientes.dto;

import com.sea.clientes.model.TipoTelefone;

import javax.validation.Valid;
import javax.validation.constraints.*;
import java.util.List;

public class ClienteRequestDTO {

    @NotBlank(message = "O nome é obrigatório")
    @Size(min = 3, max = 100, message = "Nome deve ter entre 3 e 100 caracteres")
    @Pattern(
        regexp = "^[a-zA-ZÀ-ÿ0-9 ]+$",
        message = "Nome permite apenas letras, espaços e números"
    )
    private String nome;

    @NotBlank(message = "O CPF é obrigatório")
    private String cpf;

    @NotNull(message = "O endereço é obrigatório")
    @Valid
    private EnderecoDTO endereco;

    @NotEmpty(message = "Informe pelo menos um telefone")
    @Valid
    private List<TelefoneDTO> telefones;

    @NotEmpty(message = "Informe pelo menos um e-mail")
    @Valid
    private List<EmailDTO> emails;

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }

    public EnderecoDTO getEndereco() { return endereco; }
    public void setEndereco(EnderecoDTO endereco) { this.endereco = endereco; }

    public List<TelefoneDTO> getTelefones() { return telefones; }
    public void setTelefones(List<TelefoneDTO> telefones) { this.telefones = telefones; }

    public List<EmailDTO> getEmails() { return emails; }
    public void setEmails(List<EmailDTO> emails) { this.emails = emails; }
}
