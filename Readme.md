# Blog API

API REST em Node.js, Express e MongoDB para a plataforma de blogging educacional do grupo.

O projeto agora esta alinhado para uso com Docker, Docker Compose e GitHub Actions, com foco em:

- ambiente padronizado para o grupo inteiro
- banco MongoDB em container
- healthcheck da API
- build multi-stage
- imagem final mais enxuta e segura
- validacao automatica em CI

## Tecnologias

- Node.js
- TypeScript
- Express
- MongoDB
- Mongoose
- Jest
- Supertest
- Docker
- Docker Compose
- GitHub Actions

## Estrutura principal

```text
.
|-- .github/workflows/ci.yml
|-- src/
|-- tests/
|-- .env.example
|-- docker-compose.yml
|-- Dockerfile
|-- package.json
`-- Readme.md
```

## Variaveis de ambiente

Crie um `.env` a partir do [.env.example](A:/blog-api/.env.example) se quiser personalizar portas, usuario do Mongo ou nome do banco.

Exemplo:

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

Observacoes:

- no Docker Compose, a aplicacao usa por padrao o host `db`, que e o nome do servico do Mongo
- fora do Docker, ajuste o `MONGODB_URI` para o host correto da sua maquina
- `USE_IN_MEMORY_DB=true` e util para execucao local sem Mongo externo

## Como rodar com Docker

### Subir a aplicacao

```bash
docker compose up --build -d
```

### Verificar se os containers estao saudaveis

```bash
docker compose ps
```

### Ver logs

```bash
docker compose logs -f app
docker compose logs -f db
```

### Parar os containers

```bash
docker compose down
```

### Parar e apagar tambem o volume do banco

```bash
docker compose down -v
```

## Endpoints uteis para validacao

- API: [http://localhost:3000](http://localhost:3000)
- Swagger: [http://localhost:3000/docs](http://localhost:3000/docs)
- Healthcheck: [http://localhost:3000/health](http://localhost:3000/health)

## Como rodar sem Docker

```bash
npm ci
npm test
npm run build
npm start
```

### Desenvolvimento

```bash
npm ci
npm run dev
```

## Seeds

Para popular o banco configurado em `MONGODB_URI`:

```bash
npm run seed
```

## O que a pipeline faz

O workflow em [.github/workflows/ci.yml](A:/blog-api/.github/workflows/ci.yml) executa:

- `npm ci`
- `npm test`
- `npm run build`
- validacao do stage `test` do `Dockerfile`
- `docker compose up --build -d`
- smoke test em `/health`

## Boas praticas aplicadas no Docker

- build multi-stage
- stage separado para testes
- imagem final `distroless`
- runtime com usuario sem privilegios
- `read_only` no container da API
- `tmpfs` para `/tmp`
- `cap_drop: ALL`
- `no-new-privileges`
- `healthcheck` da aplicacao

## Solucao rapida de problemas

### Porta 3000 ocupada

Troque a porta no `.env`:

```env
PORT=3001
```

Depois rode novamente:

```bash
docker compose up --build -d
```

### Porta 27017 ocupada

Troque no `.env`:

```env
MONGO_PORT=27018
```

### Docker Desktop nao abriu

Abra o Docker Desktop e espere o engine iniciar antes de rodar `docker compose`.

### Aplicacao nao sobe

Confira:

```bash
docker compose logs -f app
docker compose logs -f db
```
