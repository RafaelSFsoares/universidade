AdonisApp – Universidade 🎓

API desenvolvida em AdonisJS como parte do sistema Universidade.
Permite gerenciar Alunos, Professores e Salas com operações de CRUD e validações de regras de negócio.

# 🚀 Tecnologias

Node.js

AdonisJS

Banco de dados: MySQL (padrão, pode alterar no .env)

# 📦 Instalação
Passo-a-passo para rodar localmente.
 clonar o repositório
git clone https://github.com/RafaelSFsoares/universidade.git

entrar na pasta
cd universidade/adonisApp

# 🔧 instalar dependências
npm install

# ⚙️ Configuração

Coonfigure seu .env ou copie cp .env.example .env:


Exemplo:

HOST=127.0.0.1

PORT=3333

DB_CONNECTION=mysql

DB_HOST=127.0.0.1

DB_PORT=3306

DB_USER=root

DB_PASSWORD=root

DB_NAME=universidade

Depois, rode as migrations:

node ace migration:run

Se houver seeds:

node ace db:seed



# ▶️ modo desenvolvimento

Execução
npm run dev

API disponível em:
👉 http://localhost:3333


📚 Rotas principais

Todas as rotas estão sob o prefixo /api.

👨‍🎓 Alunos

POST /api/aluno/consultaAluno → Consultar aluno (show)

POST /api/aluno/cadastraAluno → Cadastrar aluno (create)

PUT /api/aluno/updateAluno → Atualizar aluno (update)

DELETE /api/aluno/deleteAluno → Deletar aluno (delete)

👨‍🏫 Professores

POST /api/professor/consultaProfessor → Consultar professor (show)

POST /api/professor/cadastraProfessor → Cadastrar professor (create)

PUT /api/professor/updateProfessor → Atualizar professor (update)

DELETE /api/professor/deleteProfessor → Deletar professor (delete)

🏫 Salas

POST /api/salas/AlunoConsultaSala → Consultar sala do aluno (consultaSala)

POST /api/salas/criaSala → Criar sala (criaSala)

POST /api/salas/alocarAluno → Alocar aluno na sala (alocarAluno)

PUT /api/salas/updateSala → Atualizar sala (updateSala)

DELETE /api/salas/deleteSala → Deletar sala (deleteSala)

DELETE /api/salas/removerAlunoSala → Remover aluno da sala (removerAlunoSala)

POST /api/salas/listarAlunosSala → Listar alunos da sala (listarAlunosSala)

(as regras de negócio incluem validação de capacidade, disponibilidade e vínculo de alunos)

# 📂 Estrutura de Pastas


adonisApp/

├── app/

│   ├── Controllers/

│   ├── Models/

│   ├── Middleware/

│   └── Validators/

├── config/

├── database/

│   ├── migrations/

│   └── seeders/

├── start/

│   └── routes.ts

├── .env.example

└── package.json

# 📜 License

Este projeto está sob a licença MIT.
