package com.sea.clientes.dto;

import com.sea.clientes.model.TipoTelefone;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

public class TelefoneDTO {

    @NotBlank(message = "O número de telefone é obrigatório")
    private String numero; // Aceita com ou sem máscara

    @NotNull(message = "O tipo de telefone é obrigatório (CELULAR, RESIDENCIAL ou COMERCIAL)")
    private TipoTelefone tipo;



    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }

    public TipoTelefone getTipo() { return tipo; }
    public void setTipo(TipoTelefone tipo) { this.tipo = tipo; }
}
