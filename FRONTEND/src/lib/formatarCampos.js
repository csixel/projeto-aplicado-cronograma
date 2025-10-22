
// Formatar telefone visualmente (11) 99911-0001
function formatarTelefone(input) {
    // Remove tudo que não é número
    let valor = input.value.replace(/\D/g, '');
    
    // Limita a 11 dígitos
    if (valor.length > 11) {
        valor = valor.substring(0, 11);
    }
    
    // Aplica a formatação
    if (valor.length <= 2) {
        input.value = valor;
    } else if (valor.length <= 7) {
        input.value = `(${valor.substring(0, 2)}) ${valor.substring(2)}`;
    } else {
        input.value = `(${valor.substring(0, 2)}) ${valor.substring(2, 7)}-${valor.substring(7)}`;
    }
}

// Formatar CPF visualmente 000.000.000-00
function formatarCPF(input) {
    // Remove tudo que não é número
    let valor = input.value.replace(/\D/g, '');
    
    // Limita a 11 dígitos
    if (valor.length > 11) {
        valor = valor.substring(0, 11);
    }
    
    // Aplica a formatação
    if (valor.length <= 3) {
        input.value = valor;
    } else if (valor.length <= 6) {
        input.value = `${valor.substring(0, 3)}.${valor.substring(3)}`;
    } else if (valor.length <= 9) {
        input.value = `${valor.substring(0, 3)}.${valor.substring(3, 6)}.${valor.substring(6)}`;
    } else {
        input.value = `${valor.substring(0, 3)}.${valor.substring(3, 6)}.${valor.substring(6, 9)}-${valor.substring(9)}`;
    }
}

// Função para remover formatação antes de enviar dados
function removerFormatacao(texto) {
    return texto.replace(/\D/g, '');
}

// Função para formatar telefone na exibição
function formatarTelefoneExibicao(telefone) {
    const numeros = telefone.replace(/\D/g, '');
    if (numeros.length === 11) {
        return numeros.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (numeros.length === 10) {
        return numeros.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return telefone;
}

// Função para formatar CPF na exibição
function formatarCPFExibicao(cpf) {
    const numeros = cpf.replace(/\D/g, '');
    if (numeros.length === 11) {
        return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return cpf;
}