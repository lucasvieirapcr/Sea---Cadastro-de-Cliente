package com.sea.clientes;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
@SpringBootApplication
public class ClientesApplication {

    public static void main(String[] args) {
        SpringApplication.run(ClientesApplication.class, args);
        System.out.println("Aplicação iniciada! (http://localhost:8080)");
    }
}