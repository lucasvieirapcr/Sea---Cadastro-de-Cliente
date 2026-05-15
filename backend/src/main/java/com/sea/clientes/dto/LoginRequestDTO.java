package com.sea.clientes.dto;

import javax.validation.constraints.NotBlank;

public class LoginRequestDTO {

    @NotBlank(message = "O username é obrigatório")
    private String username;

    @NotBlank(message = "A senha é obrigatória")
    private String senha;

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }
}
