const endPointPostCriarProfessor = "http://localhost:3000/professor/criarProfessor";

async function validarFormularioProfessor() {
    const data = {
        nome: document.getElementById("nome").value.trim(),
        email: document.getElementById("email").value.trim(),
        disciplina: document.getElementById("disciplina").value.trim(),
        telefone: removerFormatacao(document.getElementById("telefone").value),
        cpf: removerFormatacao(document.getElementById("cpf").value),
    };
    console.log('CPF após remover formatação:', data.cpf); // Debug
    // Validar CPF antes de enviar
    const cpfValido = await validarCpf(data.cpf);
    console.log('Resultado da validação:', cpfValido); // Debug
    if (cpfValido.erro) {
        alert(cpfValido.mensagem);
        return;
    }

    // Enviar apenas se CPF for válido
    try {
        await enviarFormulario(data);
        alert("Professor cadastrado com sucesso!");
    } catch (error) {
        alert("Erro ao cadastrar: " + error.message);
    }
}

async function validarCpf(cpf) {
    console.log('CPF sendo verificado:', cpf); // Debug
    try {
        if (cpf.trim().length == 0) {
            return { erro: true, mensagem: "CPF não informado" };
        }

        const response = await fetch(`http://localhost:3000/professor/buscarProfessorPorCPF/${cpf}`,{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        console.log('Status da resposta:', response.status); // Debug
        if (response.status === 200) {
            return { erro: true, mensagem: "CPF já cadastrado" };
        }
        return { erro: false, mensagem: "" };
    } catch (error) {
        console.error("Erro ao verificar CPF:", error);
        return { erro: false, mensagem: "" };
    }
}

async function enviarFormulario(data) {
    const response = await fetch(endPointPostCriarProfessor, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`HTTP${response.status}:${await response.text()}`);
}