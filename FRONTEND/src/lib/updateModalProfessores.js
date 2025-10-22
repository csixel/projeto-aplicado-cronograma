async function buscarProfessorPorId(id_professor) {
  try {
    const response = await fetch(
      `http://localhost:3000/professor/buscarProfessorPorId/${id_professor}`
    );
    if (!response.ok) throw new Error("Erro ao buscar professor");
    return await response.json();
  } catch (error) {
    console.error("Erro:", error);
    throw error;
  }
}

function editarProfessor(id_professor) {
  // 1. Buscar os dados do professor específico
  console.log('ID do professor clicado:', id_professor); // Debug
  buscarProfessorPorId(id_professor)
    .then((professor) => {
       console.log('Professor encontrado:', professor); // Debug
      // 2. Preencher os campos do modal
      document.getElementById("edit-id").value = professor.id_professor;
      document.getElementById("edit-nome").value = professor.nome;
      document.getElementById("edit-email").value = professor.email;
      document.getElementById("edit-disciplina").value = professor.disciplina;
      document.getElementById("edit-telefone").value = professor.telefone;
      document.getElementById("edit-cpf").value = professor.cpf;

      // 3. Abrir o modal
      const modal = new bootstrap.Modal(document.getElementById("editarModal"));
      modal.show();
    })
    .catch((error) => {
      console.error("Erro ao buscar professor:", error);
      alert("Erro ao carregar dados do professor");
    });
}
async function salvarEdicao() {
  const id_professor = document.getElementById("edit-id").value;
  const data = {
    nome: document.getElementById("edit-nome").value,
    email: document.getElementById("edit-email").value,
    disciplina: document.getElementById("edit-disciplina").value,
    telefone: removerFormatacao(document.getElementById("edit-telefone").value),
    cpf: removerFormatacao(document.getElementById("edit-cpf").value),
  };
  try {
    const response = await fetch(
      `http://localhost:3000/professor/alterarProfessor/${id_professor}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    if (!response.ok) throw new Error("Erro ao alterar cadastro");

    const modal = bootstrap.Modal.getInstance(
      document.getElementById("editarModal")
    );
    modal.hide();
    carregarProfessores();
    alert("Professor editado com sucesso!");
  } catch (Error) {
    console.error("Erro ao salvar:", Error);
    alert("Erro ao salvar alterações: " + Error.message);
  }
}
