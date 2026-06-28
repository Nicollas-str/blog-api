# 🚀 Tech Challenge — API com Node.js, Express e MongoDB

API REST desenvolvida para o Tech Challenge da graduação, com foco na construção de um back-end organizado, escalável e containerizado. O projeto utiliza Node.js, Express, MongoDB, Docker e Jest, aplicando boas práticas de arquitetura, testes automatizados e separação de responsabilidades.

---

# 📌 Sobre o projeto

A proposta do projeto é desenvolver uma API back-end capaz de servir como base para uma plataforma de blogging educacional, permitindo futura integração com aplicações web e mobile.

A aplicação foi construída utilizando:

- Node.js
- Express
- MongoDB
- Docker
- Jest
- Supertest
- Zod

Além disso, o projeto segue conceitos importantes de desenvolvimento back-end moderno, como:

- Arquitetura MVC
- Middlewares globais
- Validação de dados com Zod
- Variáveis de ambiente
- Containerização com Docker
- Persistência de dados
- Testes automatizados
- Pipeline CI/CD

---

# 📋 Índice

- [Pré-requisitos](#-pré-requisitos)
- [Clonando o projeto](#-clonando-o-projeto)
- [Configuração do ambiente](#-configuração-do-ambiente)
- [Executando com Docker](#-executando-com-docker)
- [Comandos do dia a dia](#-comandos-do-dia-a-dia)
- [Parando os containers](#-parando-os-containers)
- [Executando os testes](#-executando-os-testes)
- [Rotas disponíveis](#-rotas-disponíveis)
- [Estrutura do projeto](#-estrutura-do-projeto)
- [Pipeline CI/CD](#-pipeline-cicd)
- [Solução de problemas](#-solução-de-problemas)

---

# ✅ Pré-requisitos

Você precisa apenas de:

| Ferramenta | Download               | Finalidade                       |
| ---------- | ---------------------- | -------------------------------- |
| Git        | https://git-scm.com    | Clonar o repositório             |
| Docker     | https://www.docker.com | Executar a aplicação e o MongoDB |

> ⚠️ Não é necessário instalar Node.js ou MongoDB localmente. O Docker cuidará de todo o ambiente da aplicação.

---

# 📥 Clonando o projeto

```bash
# Clonar o repositório
git clone https://github.com/seu-usuario/meu-projeto.git

# Entrar na pasta do projeto
cd meu-projeto
```

---

# ⚙️ Configuração do ambiente

Crie o arquivo `.env` com base no `.env.example`.

## Linux/Mac

```bash
cp .env.example .env
```

## Windows

```bash
copy .env.example .env
```

---

## Exemplo do `.env`

```env
NODE_ENV=production
PORT=3000

MONGO_INITDB_ROOT_USERNAME=adm
MONGO_INITDB_ROOT_PASSWORD=adm
MONGO_INITDB_DATABASE=blog_api

USE_IN_MEMORY_DB=false
MONGODB_URI=mongodb://adm:adm@localhost:27017/blog_api?authSource=admin
```

## Exemplo do `.env` para uso com Docker Compose

O arquivo `.env.example` do projeto já está preparado para o ambiente com containers e inclui:

```env
NODE_ENV=production
PORT=3000

MONGO_INITDB_ROOT_USERNAME=adm
MONGO_INITDB_ROOT_PASSWORD=adm
MONGO_INITDB_DATABASE=blog_api
MONGO_PORT=27017

USE_IN_MEMORY_DB=false
MONGODB_URI=mongodb://adm:adm@db:27017/blog_api?authSource=admin
```

> 💡 No Docker Compose, o host `db` é o nome do serviço do MongoDB.

se USE_IN_MEMORY_DB=true usara memoria local

> 💡 O arquivo `.env` contém variáveis sensíveis e não deve ser enviado para o GitHub.

---

# 🐳 Executando com Docker

## Primeira execução

```bash
docker compose up --build -d
```

Esse comando irá:

1. Construir a imagem da aplicação
2. Baixar a imagem oficial do MongoDB
3. Instalar as dependências
4. Executar os testes automatizados
5. Criar os containers
6. Configurar a rede entre aplicação e banco
7. Iniciar a API e o MongoDB

---

## Verificando os containers

```bash
docker compose ps
```

Exemplo esperado:

```bash
NAME                  STATUS                PORTS
meu-projeto-app-1     running               0.0.0.0:3000->3000/tcp
meu-projeto-db-1      running (healthy)     0.0.0.0:27017->27017/tcp
```

> 💡 Após a inicialização completa, a API também deve responder ao endpoint `/health`, utilizado no healthcheck do container e na validação da pipeline.

---

# 🌐 Acessando a aplicação

Após subir os containers:

| Serviço     | URL                            |
| ----------- | ------------------------------ |
| API         | http://localhost:3000          |
| Swagger     | http://localhost:3000/docs     |
| Healthcheck | http://localhost:3000/health   |
| MongoDB     | localhost:27017                |

> 💡 A rota raiz `http://localhost:3000/` redireciona para a documentação Swagger.

---

# 🧪 Testando a API

Com a API iniciada e o MongoDB acessível pela variável `MONGODB_URI`, use o Postman ou `curl` para validar as rotas de posts.

Se você estiver sem MongoDB local, defina `USE_IN_MEMORY_DB=true` no `.env`. Nesse modo a API sobe com dados de exemplo em memória e permite testar tudo no Postman sem banco externo.

Exemplo de criação de post:

```bash
curl --request POST http://localhost:3000/posts \
  --header "Content-Type: application/json" \
  --data '{
    "title": "Novo post",
    "content": "Conteúdo completo do post",
    "summary": "Resumo do post",
    "disciplineId": "ID_DA_DISCIPLINA",
    "authorId": "ID_DO_PROFESSOR",
    "statusId": "ID_DO_STATUS"
  }'
```

Regra importante: apenas usuários com email terminando em `@professor.com` podem criar novos posts.

---

# 📌 Comandos do dia a dia

| Comando                        | Descrição                    |
| ------------------------------ | ---------------------------- |
| `docker compose up --build -d` | Builda e sobe os containers  |
| `docker compose up -d`         | Sobe sem rebuild             |
| `docker compose ps`            | Lista containers ativos      |
| `docker compose logs -f app`   | Logs da aplicação            |
| `docker compose logs -f db`    | Logs do MongoDB              |
| `docker compose stop`          | Pausa os containers          |
| `docker compose start`         | Reinicia containers pausados |
| `docker compose down`          | Remove containers            |
| `docker compose down -v`       | Remove containers e volumes  |

---

# ⏹️ Parando os containers

## Apenas pausar

```bash
docker compose stop
```

## Continuar containers pausados

```bash
docker compose start
```

## Remover containers

```bash
docker compose down
```

## Remover containers e banco de dados

```bash
docker compose down -v
```

> ⚠️ O comando `-v` remove os volumes e apaga permanentemente os dados do MongoDB.

---

# 🧪 Executando os testes

Os testes utilizam Jest, Supertest e `mongodb-memory-server`, então não dependem do MongoDB externo para validação automatizada.

## Instalar dependências localmente

```bash
npm install
```

## Rodar os testes

```bash
npm test
```

O projeto utiliza:

- Jest
- Supertest
- Cobertura de testes (`--coverage`)
- MongoDB em memória para testes de integração

## Popular dados para teste manual

Para criar usuários, disciplinas, status e posts de exemplo no banco configurado em `MONGODB_URI`:

```bash
npm run seed
```

O seed cria:

- 1 professor autorizado a publicar
- 1 usuário sem permissão de publicação
- 2 disciplinas
- 2 status
- 2 posts iniciais

## Modelagem persistida

O projeto usa Mongoose como ODM com os seguintes modelos:

- `User`: dados de autenticação e autorização do autor
- `Discipline`: categoria acadêmica do conteúdo
- `Status`: estado editorial do post
- `Post`: entidade central com referências para autor, disciplina e status

Relacionamentos aplicados:

- `User (1) -> (N) Posts`
- `Discipline (1) -> (N) Posts`
- `Status (1) -> (N) Posts`

As referências são persistidas no MongoDB por `ObjectId` e retornadas populadas nas consultas de posts.

# 🛣️ Rotas disponíveis

| Método | Endpoint           | Descrição |
| ------ | ------------------ | --------- |
| GET    | `/catalog/users`           | Lista usuários disponíveis para teste |
| POST   | `/catalog/users`           | Cria um novo usuário |
| PUT    | `/catalog/users/:id`       | Atualiza um usuário existente |
| DELETE | `/catalog/users/:id`       | Remove um usuário existente |
| GET    | `/catalog/disciplines`     | Lista disciplinas disponíveis para seleção |
| POST   | `/catalog/disciplines`     | Cria uma nova disciplina |
| PUT    | `/catalog/disciplines/:id` | Atualiza uma disciplina existente |
| DELETE | `/catalog/disciplines/:id` | Remove uma disciplina existente |
| GET    | `/catalog/status`          | Lista status disponíveis para seleção |
| POST   | `/catalog/status`          | Cria um novo status |
| PUT    | `/catalog/status/:id`      | Atualiza um status existente |
| DELETE | `/catalog/status/:id`      | Remove um status existente |
| GET    | `/posts`           | Lista somente os posts com status ativo |
| GET    | `/posts/:id`       | Busca um post por ID |
| POST   | `/posts`           | Cria um post validando autor com domínio `@professor.com` |
| PUT    | `/posts/:id`       | Atualiza um post existente |
| DELETE | `/posts/:id`       | Remove um post existente |

> 💡 O `GET /posts` retorna apenas posts vinculados a um status com `isActive: true`. Posts com status inativo não aparecem na listagem.

---

# 🛣️ Rotas disponíveis

| Método | Endpoint     | Descrição            |
| ------ | ------------ | -------------------- |
| GET    | `/`          | Status da API        |
| GET    | `/posts`     | Lista todos os posts |
| GET    | `/posts/:id` | Busca um post por ID |

---

# 📁 Estrutura do projeto

```bash
src/
├── controllers/
├── services/
├── routes/
├── middlewares/
├── schemas/
├── config/
├── interfaces/
├── app.ts
└── index.ts

tests/
├── posts.test.ts
├── catalog.test.ts

Dockerfile
docker-compose.yml
package.json
.env
.env.example
```

Além dessa estrutura, o projeto também conta com o workflow `.github/workflows/ci.yml` para automatizar a validação no GitHub Actions.

---

# 🏗️ Arquitetura da aplicação

O projeto utiliza arquitetura MVC para organização das responsabilidades:

| Camada      | Responsabilidade                          |
| ----------- | ----------------------------------------- |
| Routes      | Gerenciamento das rotas                   |
| Controllers | Controle das requisições                  |
| Services    | Regras de negócio                         |
| Schemas     | Validação e sanitização dos dados com Zod |
| Models      | Estrutura e manipulação dos dados         |
| Middlewares | Validação de entrada e tratamento de erros|

---

# 🔄 Pipeline CI/CD

A cada `push` ou `pull request` na branch principal, o GitHub Actions executa:

```text
Push para o GitHub
       │
       ▼
  Job: test
  └── npm install
  └── npm test
       │
       ▼
  Job: docker
  └── docker build
  └── docker compose up
  └── docker compose down
```

No workflow atual em `.github/workflows/ci.yml`, essa validação foi detalhada em:

- `npm ci`
- `npm test`
- `npm run build`
- `docker build --target test -t blog-api:test .`
- `docker compose up --build -d`
- smoke test em `http://127.0.0.1:3000/health`
- `docker compose down -v`

Isso garante que:

- os testes estejam funcionando
- a imagem Docker seja construída corretamente
- a aplicação consiga subir sem erros

---

# 🔧 Solução de problemas

## Porta 3000 já está em uso

```bash
docker compose down
```

Ou altere a porta no `docker-compose.yml`:

```yaml
ports:
  - "3001:3000"
```

---

## Porta 27017 já está em uso

Altere a variável `MONGO_PORT` no `.env`:

```env
MONGO_PORT=27018
```

---

## Docker daemon não está rodando

Abra o Docker Desktop e aguarde a inicialização.

---

## Banco não conecta

Verifique os logs:

```bash
docker compose logs db
```

Depois tente novamente:

```bash
docker compose up -d
```

---

## Alterações no código não aparecem

Reconstrua os containers:

```bash
docker compose up --build -d
```

---

# 👨‍💻 Autor

Projeto acadêmico desenvolvido para o Tech Challenge utilizando Node.js, Express, MongoDB, Docker e Jest.
