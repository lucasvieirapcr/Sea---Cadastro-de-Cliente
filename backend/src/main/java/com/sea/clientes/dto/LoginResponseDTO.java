package com.sea.clientes.dto;

public class LoginResponseDTO {

    private String token;
    private String papel;
    private String username;

    public LoginResponseDTO(String token, String papel, String username) {
        this.token = token;
        this.papel = papel;
        this.username = username;
    }

    public String getToken() { return token; }
    public String getPapel() { return papel; }
    public String getUsername() { return username; }
}
