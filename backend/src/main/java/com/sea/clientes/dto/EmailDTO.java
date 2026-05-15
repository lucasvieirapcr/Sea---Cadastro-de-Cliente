package com.sea.clientes.dto;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

public class EmailDTO {

    @NotBlank(message = "O e-mail é obrigatório")
    @Email(message = "Informe um e-mail válido (ex: joao@email.com)")
    private String endereco;


    public String getEndereco() { return endereco; }
    public void setEndereco(String endereco) { this.endereco = endereco; }
}
