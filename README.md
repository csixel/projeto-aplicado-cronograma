# **Projeto Cronograma de Aulas**

Este é um sistema de gerenciamento de cronograma de aulas que permite o cadastro de professores e a consulta de cronogramas por parte dos alunos.

Antes de executar o projeto, certifique-se de ter instalado em seu computador:

* Node.js (versão 14 ou superior)
* MySQL (versão 5.7 ou superior)
* VS Code (ou outra IDE de sua preferência)

## 🚀 **Como executar o projeto**

### **1. Configuração do Banco de Dados**
* sql :** CREATE DATABASE escola**;
  ** Observação importante: Caso ocorra algum erro de conexão com o banco de dados, verifique se a senha do usuário root do MySQL está configurada como "root".

### **2. Execução do Backend**

- Abra o terminal do VS Code
- Navegue até a pasta do backend:
- cd cadastroProf/BACKEND
- Execute o servidor backend: **npm run dev**

### **3. Execução do Frontend**

Após o backend estar rodando, abra qualquer página do frontend no seu navegador.

**As principais páginas são:**

* cronograma.html - Interface para gerenciamento do cronograma
* cronograma_aluno.html - Interface para consulta do cronograma pelos alunos


## 📁 **Estrutura do Projeto**

projeto-aplicado-cronograma/

├── cadastroProf/

│   ├── BACKEND/          # Servidor Node.js/Express

│   └── FRONTEND/         # Interface web (HTML, CSS, JS)

## **Funcionalidades**

- Cadastro de professores
- Gerenciamento de cronograma de aulas
- Consulta de cronograma para alunos
- Interface administrativa e para alunos

## **Acesso**
O projeto estará disponível localmente após a execução dos passos acima. Acesse as páginas HTML diretamente pelo navegador.

## Observações
-  Certifique-se de que o MySQL está rodando antes de executar o backend
- O backend deve estar em execução para que as funcionalidades do frontend funcionem corretamente
- Em caso de problemas de conexão com o banco, verifique as credenciais no código do backend
