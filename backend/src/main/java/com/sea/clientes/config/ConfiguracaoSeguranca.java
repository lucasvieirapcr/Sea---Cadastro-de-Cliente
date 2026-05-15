package com.sea.clientes.config;

import com.sea.clientes.model.Usuario;
import com.sea.clientes.repository.UsuarioRepository;
import com.sea.clientes.security.FiltroJwt;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class ConfiguracaoSeguranca {

    private final FiltroJwt filtroJwt;

    @Value("${app.cors.origens-permitidas}")
    private String origensPermitidas;

    public ConfiguracaoSeguranca(FiltroJwt filtroJwt) {
        this.filtroJwt = filtroJwt;
    }

    @Bean
    public SecurityFilterChain configurarSeguranca(HttpSecurity http) throws Exception {

        http
            .cors().and()
            .csrf().disable()
            .authorizeRequests()
                .antMatchers("/api/auth/login").permitAll()
                .antMatchers("/h2-console/**").permitAll()
                .antMatchers(HttpMethod.GET, "/api/clientes/**").authenticated()
                .antMatchers(HttpMethod.GET, "/api/cep/**").authenticated()
                .antMatchers("/api/clientes/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            .and()
            .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .headers().frameOptions().disable();

        http.addFilterBefore(filtroJwt, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder criptografadorDeSenha() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager gerenciadorDeAutenticacao(
            AuthenticationConfiguration configuracao) throws Exception {
        return configuracao.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource configuracaoCors() {
        CorsConfiguration config = new CorsConfiguration();

        List<String> origens = Arrays.asList(origensPermitidas.split(","));
        config.setAllowedOrigins(origens);

        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        config.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }

    @Bean
    public CommandLineRunner criarUsuariosIniciais(
            UsuarioRepository usuarioRepository,
            PasswordEncoder criptografador) {

        return argumentos -> {
            if (usuarioRepository.count() == 0) {
                Usuario admin = new Usuario();
                admin.setUsername("admin");
                admin.setSenha(criptografador.encode("123qwel@#"));
                admin.setPapel("ADMIN");
                usuarioRepository.save(admin);
                Usuario usuario = new Usuario();
                usuario.setUsername("usuario");
                usuario.setSenha(criptografador.encode("123qwe123"));
                usuario.setPapel("PADRAO");
                usuarioRepository.save(usuario);

                System.out.println("=== Usuários criados: admin (senha: 123qwel@#) | usuario (senha: 123qwe123) ===");
            }
        };
    }
}
