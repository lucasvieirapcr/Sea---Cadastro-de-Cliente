package com.sea.clientes.service;

import com.sea.clientes.dto.*;
import com.sea.clientes.exception.RecursoNaoEncontradoException;
import com.sea.clientes.exception.RegraDeNegocioException;
import com.sea.clientes.model.*;
import com.sea.clientes.repository.ClienteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;

    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    @Transactional(readOnly = true)
    public List<ClienteResponseDTO> listarTodos() {
        List<Cliente> clientes = clienteRepository.findAll();
        List<ClienteResponseDTO> resposta = new ArrayList<>();
        for (Cliente cliente : clientes) {
            resposta.add(converterParaDTO(cliente));
        }

        return resposta;
    }

    @Transactional(readOnly = true)
    public ClienteResponseDTO buscarPorId(Long id) {
        Optional<Cliente> clienteOpcional = clienteRepository.findById(id);
        if (!clienteOpcional.isPresent()) {
            throw new RecursoNaoEncontradoException("Cliente com id " + id + " não encontrado");
        }

        Cliente cliente = clienteOpcional.get();
        return converterParaDTO(cliente);
    }

    @Transactional
    public ClienteResponseDTO criar(ClienteRequestDTO dto) {

        String cpfSemMascara = removerMascara(dto.getCpf());

        if (!cpfValido(cpfSemMascara)) {
            throw new RegraDeNegocioException("CPF inválido: " + dto.getCpf());
        }

        if (clienteRepository.existsByCpf(cpfSemMascara)) {
            throw new RegraDeNegocioException("Já existe um cliente com o CPF: " + dto.getCpf());
        }

        Cliente novoCliente = new Cliente();
        novoCliente.setNome(dto.getNome().trim());
        novoCliente.setCpf(cpfSemMascara);

        Endereco endereco = criarEndereco(dto.getEndereco());
        novoCliente.setEndereco(endereco);

        List<Telefone> telefones = criarTelefones(dto.getTelefones(), novoCliente);
        novoCliente.setTelefones(telefones);

        List<Email> emails = criarEmails(dto.getEmails(), novoCliente);
        novoCliente.setEmails(emails);

        Cliente clienteSalvo = clienteRepository.save(novoCliente);
        return converterParaDTO(clienteSalvo);
    }

    @Transactional
    public ClienteResponseDTO atualizar(Long id, ClienteRequestDTO dto) {

        Optional<Cliente> clienteOpcional = clienteRepository.findById(id);
        if (!clienteOpcional.isPresent()) {
            throw new RecursoNaoEncontradoException("Cliente com id " + id + " não encontrado");
        }

        Cliente clienteExistente = clienteOpcional.get();

        String cpfSemMascara = removerMascara(dto.getCpf());
        if (!cpfValido(cpfSemMascara)) {
            throw new RegraDeNegocioException("CPF inválido: " + dto.getCpf());
        }

        Optional<Cliente> clienteComMesmoCpf = clienteRepository.findByCpf(cpfSemMascara);
        if (clienteComMesmoCpf.isPresent()) {
            boolean cpfEhDeOutroCliente = !clienteComMesmoCpf.get().getId().equals(id);
            if (cpfEhDeOutroCliente) {
                throw new RegraDeNegocioException("Já existe outro cliente com o CPF: " + dto.getCpf());
            }
        }

        clienteExistente.setNome(dto.getNome().trim());
        clienteExistente.setCpf(cpfSemMascara);
        clienteExistente.setEndereco(criarEndereco(dto.getEndereco()));

        clienteExistente.getTelefones().clear();
        List<Telefone> novosTelefones = criarTelefones(dto.getTelefones(), clienteExistente);
        clienteExistente.getTelefones().addAll(novosTelefones);

        clienteExistente.getEmails().clear();
        List<Email> novosEmails = criarEmails(dto.getEmails(), clienteExistente);
        clienteExistente.getEmails().addAll(novosEmails);

        Cliente clienteAtualizado = clienteRepository.save(clienteExistente);
        return converterParaDTO(clienteAtualizado);
    }

    @Transactional
    public void deletar(Long id) {
        if (!clienteRepository.existsById(id)) {
            throw new RecursoNaoEncontradoException("Cliente com id " + id + " não encontrado");
        }
        clienteRepository.deleteById(id);
    }

    private ClienteResponseDTO converterParaDTO(Cliente cliente) {
        ClienteResponseDTO dto = new ClienteResponseDTO();
        dto.setId(cliente.getId());
        dto.setNome(cliente.getNome());
        dto.setCpf(aplicarMascaraCpf(cliente.getCpf()));

        if (cliente.getEndereco() != null) {
            ClienteResponseDTO.EnderecoResposta enderecoDto = new ClienteResponseDTO.EnderecoResposta();
            enderecoDto.setCep(aplicarMascaraCep(cliente.getEndereco().getCep()));
            enderecoDto.setLogradouro(cliente.getEndereco().getLogradouro());
            enderecoDto.setBairro(cliente.getEndereco().getBairro());
            enderecoDto.setCidade(cliente.getEndereco().getCidade());
            enderecoDto.setUf(cliente.getEndereco().getUf());
            enderecoDto.setNumero(cliente.getEndereco().getNumero());
            enderecoDto.setComplemento(cliente.getEndereco().getComplemento());
            dto.setEndereco(enderecoDto);
        }

        List<ClienteResponseDTO.TelefoneResposta> telefonesDto = new ArrayList<>();
        for (Telefone telefone : cliente.getTelefones()) {
            ClienteResponseDTO.TelefoneResposta telDto = new ClienteResponseDTO.TelefoneResposta();
            telDto.setId(telefone.getId());
            telDto.setTipo(telefone.getTipo());
            telDto.setNumero(aplicarMascaraTelefone(telefone.getNumero(), telefone.getTipo()));
            telefonesDto.add(telDto);
        }
        dto.setTelefones(telefonesDto);

        List<ClienteResponseDTO.EmailResposta> emailsDto = new ArrayList<>();
        for (Email email : cliente.getEmails()) {
            ClienteResponseDTO.EmailResposta emailDto = new ClienteResponseDTO.EmailResposta();
            emailDto.setId(email.getId());
            emailDto.setEndereco(email.getEndereco());
            emailsDto.add(emailDto);
        }
        dto.setEmails(emailsDto);

        return dto;
    }

    private Endereco criarEndereco(EnderecoDTO dto) {
        Endereco endereco = new Endereco();
        endereco.setCep(removerMascara(dto.getCep()));
        endereco.setLogradouro(dto.getLogradouro().trim());
        endereco.setBairro(dto.getBairro().trim());
        endereco.setCidade(dto.getCidade().trim());
        endereco.setUf(dto.getUf().toUpperCase().trim());
        endereco.setNumero(dto.getNumero());
        endereco.setComplemento(dto.getComplemento());
        return endereco;
    }

    private List<Telefone> criarTelefones(List<TelefoneDTO> dtos, Cliente cliente) {
        List<Telefone> telefones = new ArrayList<>();
        for (TelefoneDTO dto : dtos) {
            Telefone telefone = new Telefone();
            telefone.setNumero(removerMascara(dto.getNumero()));
            telefone.setTipo(dto.getTipo());
            telefone.setCliente(cliente);
            telefones.add(telefone);
        }
        return telefones;
    }

    private List<Email> criarEmails(List<EmailDTO> dtos, Cliente cliente) {
        List<Email> emails = new ArrayList<>();
        for (EmailDTO dto : dtos) {
            Email email = new Email();
            email.setEndereco(dto.getEndereco().toLowerCase().trim());
            email.setCliente(cliente);
            emails.add(email);
        }
        return emails;
    }

    private String removerMascara(String valor) {
        if (valor == null) return "";
        return valor.replaceAll("[^0-9]", "");
    }

    private String aplicarMascaraCpf(String cpf) {
        if (cpf == null || cpf.length() != 11) return cpf;
        return cpf.substring(0, 3) + "."
             + cpf.substring(3, 6) + "."
             + cpf.substring(6, 9) + "-"
             + cpf.substring(9, 11);
    }

    private String aplicarMascaraCep(String cep) {
        if (cep == null || cep.length() != 8) return cep;
        return cep.substring(0, 5) + "-" + cep.substring(5, 8);
    }

    private String aplicarMascaraTelefone(String numero, TipoTelefone tipo) {
        if (numero == null) return numero;

        if (tipo == TipoTelefone.CELULAR && numero.length() == 11) {
            return "(" + numero.substring(0, 2) + ") "
                 + numero.substring(2, 7) + "-"
                 + numero.substring(7, 11);
        }

        if (numero.length() == 10) {
            return "(" + numero.substring(0, 2) + ") "
                 + numero.substring(2, 6) + "-"
                 + numero.substring(6, 10);
        }

        return numero;
    }

    private boolean cpfValido(String cpf) {
        if (cpf == null || cpf.length() != 11) return false;
        boolean todosIguais = true;
        for (int i = 1; i < 11; i++) {
            if (cpf.charAt(i) != cpf.charAt(0)) {
                todosIguais = false;
                break;
            }
        }
        if (todosIguais) return false;

        int soma1 = 0;
        for (int i = 0; i < 9; i++) {
            int digito = Character.getNumericValue(cpf.charAt(i));
            soma1 += digito * (10 - i);
        }
        int primeiroVerificador = (soma1 * 10) % 11;
        if (primeiroVerificador == 10) primeiroVerificador = 0;

        if (primeiroVerificador != Character.getNumericValue(cpf.charAt(9))) {
            return false;
        }

        int soma2 = 0;
        for (int i = 0; i < 10; i++) {
            int digito = Character.getNumericValue(cpf.charAt(i));
            soma2 += digito * (11 - i);
        }
        int segundoVerificador = (soma2 * 10) % 11;
        if (segundoVerificador == 10) segundoVerificador = 0;

        return segundoVerificador == Character.getNumericValue(cpf.charAt(10));
    }
}
