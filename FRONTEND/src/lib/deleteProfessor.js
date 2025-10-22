// Função principal de exclusão
async function excluirProfessor(cpf) {
     try {
        // 1. Buscar dados do professor para confirmação
        const professor = await buscarProfessorPorCPF(cpf);
        
        // 2. Confirmar exclusão
        if (confirm(`Tem certeza que deseja excluir o professor ${professor.nome}?`)) {
            // 3. Fazer a exclusão
            const response = await fetch(`http://localhost:3000/professor/deletarProfessor/${cpf}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                alert('Professor excluído com sucesso!');
                // 4. Atualizar a tabela
                carregarProfessores();
            } else {
                alert('Erro ao excluir professor');
            }
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao excluir professor');
    }
}
// Função para buscar dados do professor (para mostrar no modal)
async function buscarProfessorPorCPF(cpf) {
    try {
    const resp = await fetch(
      `http://localhost:3000/professor/buscarProfessorPorCPF/${cpf}`
    );
    if (!resp.ok) throw new Error("erro ao conectar a API");
    const data = await resp.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    return null
  }
}
