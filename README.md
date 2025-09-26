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
Alunos

POST /alunos → Cadastrar aluno

GET /alunos → Listar alunos

GET /alunos/:id → Buscar aluno específico

PUT /alunos/:id → Atualizar aluno

DELETE /alunos/:id → Remover aluno

Professores

POST /professores → Cadastrar professor

GET /professores → Listar professores

GET /professores/:id → Buscar professor específico

PUT /professores/:id → Atualizar professor

DELETE /professores/:id → Remover professor

Salas

POST /salas → Criar sala

GET /salas → Listar salas

GET /salas/:id → Buscar sala específica

PUT /salas/:id → Atualizar sala

DELETE /salas/:id → Remover sala

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
