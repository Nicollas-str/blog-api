import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../src/app";
import connectDB, { disconnectDB } from "../src/config/database";
import DisciplineModel from "../src/models/disciplines.model";
import StatusModel from "../src/models/status.model";
import UserModel from "../src/models/users.model";

let mongoServer: MongoMemoryServer;
let userId: string;
let disciplineId: string;
let statusId: string;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await connectDB(mongoServer.getUri());
});

beforeEach(async () => {
  await UserModel.deleteMany({});
  await DisciplineModel.deleteMany({});
  await StatusModel.deleteMany({});

  const user = await UserModel.create({
    name: "Prof Teste",
    username: "prof.teste",
    password: "123456",
    email: "prof@professor.com",
    isActive: true,
  });

  const discipline = await DisciplineModel.create({
    label: "Matemática",
    order: 1,
    isActive: true,
  });

  const status = await StatusModel.create({
    label: "Publicado",
    order: 1,
    isActive: true,
  });

  userId = user.id;
  disciplineId = discipline.id;
  statusId = status.id;
});

afterAll(async () => {
  await disconnectDB();
  await mongoServer.stop();
});

// ──────────────────────────── Usuários ────────────────────────────────────────

describe("GET /users", () => {
  it("deve listar os usuários cadastrados", async () => {
    const response = await request(app).get("/catalog/users");

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "Prof Teste" }),
      ]),
    );
  });
});

describe("POST /users", () => {
  it("deve criar um novo usuário com sucesso", async () => {
    const response = await request(app).post("/catalog/users").send({
      name: "Prof. Silva",
      username: "prof.silva",
      password: "senha123",
      email: "silva@professor.com",
      isActive: true,
    });

    expect(response.status).toBe(201);
    expect(response.body.data).toEqual(
      expect.objectContaining({ email: "silva@professor.com" }),
    );
  });

  it("deve retornar 409 quando e-mail já estiver cadastrado", async () => {
    const response = await request(app).post("/catalog/users").send({
      name: "Outro Prof",
      username: "outro.prof",
      password: "123456",
      email: "prof@professor.com",
      isActive: true,
    });

    expect(response.status).toBe(409);
    expect(response.body.message).toBe("Email ou username já cadastrado");
  });

  it("deve retornar 409 quando username já estiver cadastrado", async () => {
    const response = await request(app).post("/catalog/users").send({
      name: "Prof. Outro",
      username: "prof.teste",
      password: "123456",
      email: "outro@professor.com",
      isActive: true,
    });

    expect(response.status).toBe(409);
    expect(response.body.message).toBe("Email ou username já cadastrado");
  });

  it("deve retornar 400 quando o body vier vazio", async () => {
    const response = await request(app)
      .post("/catalog/users")
      .set("Content-Type", "application/json")
      .send();

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Body da requisição não informado");
  });

  it("deve retornar 400 quando e-mail for inválido", async () => {
    const response = await request(app).post("/catalog/users").send({
      name: "Prof",
      username: "prof.x",
      password: "123456",
      email: "nao-e-um-email",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });
});

describe("PUT /users/:id", () => {
  it("deve atualizar o nome do usuário com sucesso", async () => {
    const response = await request(app).put(`/catalog/users/${userId}`).send({
      name: "Nome Atualizado",
    });

    expect(response.status).toBe(200);
    expect(response.body.data.name).toBe("Nome Atualizado");
  });

  it("deve desativar o usuário com sucesso", async () => {
    const response = await request(app).put(`/catalog/users/${userId}`).send({
      isActive: false,
    });

    expect(response.status).toBe(200);
    expect(response.body.data.isActive).toBe(false);
  });

  it("deve retornar 404 para usuário inexistente", async () => {
    const response = await request(app)
      .put("/catalog/users/000000000000000000000001")
      .send({ name: "Teste" });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Usuário não encontrado");
  });

  it("deve retornar 400 para ID inválido no PUT de usuário", async () => {
    const response = await request(app).put("/catalog/users/id-errado").send({
      name: "Teste",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  it("deve retornar 400 quando o body vier vazio no PUT", async () => {
    const response = await request(app)
      .put(`/catalog/users/${userId}`)
      .set("Content-Type", "application/json")
      .send();

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Body da requisição não informado");
  });
});

describe("DELETE /users/:id", () => {
  it("deve remover o usuário com sucesso", async () => {
    const response = await request(app).delete(`/catalog/users/${userId}`);

    expect(response.status).toBe(204);
  });

  it("deve retornar 404 ao remover usuário inexistente", async () => {
    const response = await request(app).delete("/catalog/users/000000000000000000000001");

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Usuário não encontrado");
  });

  it("deve retornar 400 para ID inválido no DELETE de usuário", async () => {
    const response = await request(app).delete("/catalog/users/id-invalido");

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });
});

// ─────────────────────────────── Disciplinas ────────────────────────────────────────

describe("GET /disciplines", () => {
  it("deve listar as disciplinas cadastradas", async () => {
    const response = await request(app).get("/catalog/disciplines");

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: "Matemática" }),
      ]),
    );
  });
});

describe("POST /disciplines", () => {
  it("deve criar uma nova disciplina com sucesso", async () => {
    const response = await request(app).post("/catalog/disciplines").send({
      label: "Física",
      order: 2,
      isActive: true,
    });

    expect(response.status).toBe(201);
    expect(response.body.data).toEqual(
      expect.objectContaining({ label: "Física" }),
    );
  });

  it("deve retornar 409 quando label já estiver cadastrado", async () => {
    const response = await request(app).post("/catalog/disciplines").send({
      label: "Matemática",
      order: 2,
      isActive: true,
    });

    expect(response.status).toBe(409);
    expect(response.body.message).toBe("Disciplina já cadastrada");
  });

  it("deve retornar 400 quando o body vier vazio", async () => {
    const response = await request(app)
      .post("/catalog/disciplines")
      .set("Content-Type", "application/json")
      .send();

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Body da requisição não informado");
  });

  it("deve retornar 400 quando label estiver ausente", async () => {
    const response = await request(app).post("/catalog/disciplines").send({
      order: 2,
      isActive: true,
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });
});

describe("PUT /disciplines/:id", () => {
  it("deve atualizar o label da disciplina com sucesso", async () => {
    const response = await request(app).put(`/catalog/disciplines/${disciplineId}`).send({
      label: "Matemática Avançada",
    });

    expect(response.status).toBe(200);
    expect(response.body.data.label).toBe("Matemática Avançada");
  });

  it("deve desativar a disciplina com sucesso", async () => {
    const response = await request(app).put(`/catalog/disciplines/${disciplineId}`).send({
      isActive: false,
    });

    expect(response.status).toBe(200);
    expect(response.body.data.isActive).toBe(false);
  });

  it("deve retornar 404 para disciplina inexistente", async () => {
    const response = await request(app)
      .put("/catalog/disciplines/000000000000000000000001")
      .send({ label: "Teste" });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Disciplina não encontrada");
  });

  it("deve retornar 400 para ID inválido no PUT de disciplina", async () => {
    const response = await request(app).put("/catalog/disciplines/id-errado").send({
      label: "Teste",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });
});

describe("DELETE /disciplines/:id", () => {
  it("deve remover a disciplina com sucesso", async () => {
    const response = await request(app).delete(`/catalog/disciplines/${disciplineId}`);

    expect(response.status).toBe(204);
  });

  it("deve retornar 404 ao remover disciplina inexistente", async () => {
    const response = await request(app).delete("/catalog/disciplines/000000000000000000000001");

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Disciplina não encontrada");
  });

  it("deve retornar 400 para ID inválido no DELETE de disciplina", async () => {
    const response = await request(app).delete("/catalog/disciplines/id-invalido");

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });
});

// ─────────────────────────────── Status ────────────────────────────────────────

describe("GET /status", () => {
  it("deve listar os status cadastrados", async () => {
    const response = await request(app).get("/catalog/status");

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: "Publicado" }),
      ]),
    );
  });
});

describe("POST /status", () => {
  it("deve criar um novo status com sucesso", async () => {
    const response = await request(app).post("/catalog/status").send({
      label: "Rascunho",
      order: 2,
      isActive: true,
    });

    expect(response.status).toBe(201);
    expect(response.body.data).toEqual(
      expect.objectContaining({ label: "Rascunho" }),
    );
  });

  it("deve retornar 409 quando label já estiver cadastrado", async () => {
    const response = await request(app).post("/catalog/status").send({
      label: "Publicado",
      order: 2,
      isActive: true,
    });

    expect(response.status).toBe(409);
    expect(response.body.message).toBe("Status já cadastrado");
  });

  it("deve retornar 400 quando o body vier vazio", async () => {
    const response = await request(app)
      .post("/catalog/status")
      .set("Content-Type", "application/json")
      .send();

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Body da requisição não informado");
  });

  it("deve retornar 400 quando label estiver ausente", async () => {
    const response = await request(app).post("/catalog/status").send({
      order: 2,
      isActive: true,
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });
});

describe("PUT /status/:id", () => {
  it("deve atualizar o label do status com sucesso", async () => {
    const response = await request(app).put(`/catalog/status/${statusId}`).send({
      label: "Publicado Atualizado",
    });

    expect(response.status).toBe(200);
    expect(response.body.data.label).toBe("Publicado Atualizado");
  });

  it("deve desativar o status com sucesso", async () => {
    const response = await request(app).put(`/catalog/status/${statusId}`).send({
      isActive: false,
    });

    expect(response.status).toBe(200);
    expect(response.body.data.isActive).toBe(false);
  });

  it("deve retornar 404 para status inexistente", async () => {
    const response = await request(app)
      .put("/catalog/status/000000000000000000000001")
      .send({ label: "Teste" });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Status não encontrado");
  });

  it("deve retornar 400 para ID inválido no PUT de status", async () => {
    const response = await request(app).put("/catalog/status/id-errado").send({
      label: "Teste",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });
});

describe("DELETE /status/:id", () => {
  it("deve remover o status com sucesso", async () => {
    const response = await request(app).delete(`/catalog/status/${statusId}`);

    expect(response.status).toBe(204);
  });

  it("deve retornar 404 ao remover status inexistente", async () => {
    const response = await request(app).delete("/catalog/status/000000000000000000000001");

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Status não encontrado");
  });

  it("deve retornar 400 para ID inválido no DELETE de status", async () => {
    const response = await request(app).delete("/catalog/status/id-invalido");

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });
});
