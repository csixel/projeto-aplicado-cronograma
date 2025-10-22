async function buscarTodosProfessores() {
  try {
    const resp = await fetch(
      "http://localhost:3000/professor/buscarTodosProfessores"
    );
    if (!resp.ok) throw new Error("erro ao conectar a API");
    const data = await resp.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    return []
  }
}

function popularTabelaProfessores(professores) {
  const tbody = document.getElementById('lista-professores');
  tbody.innerHTML = ''; // Limpar tabela atual
  
  professores.forEach(professor => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${professor.nome}</td>
      <td>${professor.email}</td>
      <td>${professor.disciplina}</td>
      <td>${formatarTelefoneExibicao(professor.telefone)}</td>
      <td>${formatarCPFExibicao(professor.cpf)}</td>
      <td>
        <button class="btn btn-sm btn-outline-primary w-100" onclick="editarProfessor(${professor.id_professor})">Editar</button>
        <button class="btn btn-sm btn-outline-danger w-100" onclick="excluirProfessor('${professor.cpf}')">Excluir</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Função para carregar e exibir os dados
async function carregarProfessores() {
  const professores = await buscarTodosProfessores();
  popularTabelaProfessores(professores);
}
