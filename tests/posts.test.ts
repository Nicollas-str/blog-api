import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../src/app";
import connectDB, { disconnectDB } from "../src/config/database";
import DisciplineModel from "../src/models/disciplines.model";
import PostModel from "../src/models/posts.model";
import StatusModel from "../src/models/status.model";
import UserModel from "../src/models/users.model";

let mongoServer: MongoMemoryServer;
let professorId: string;
let studentId: string;
let disciplineId: string;
let statusId: string;
let postId: string;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await connectDB(mongoServer.getUri());
});

beforeEach(async () => {
  await Promise.all([
    PostModel.deleteMany({}),
    UserModel.deleteMany({}),
    DisciplineModel.deleteMany({}),
    StatusModel.deleteMany({}),
  ]);

  const [professor, student] = await UserModel.create([
    {
      name: "Prof Teste",
      username: "prof.teste",
      password: "123456",
      email: "prof@professor.com",
      isActive: true,
    },
    {
      name: "Aluno Teste",
      username: "aluno.teste",
      password: "123456",
      email: "aluno@gmail.com",
      isActive: true,
    },
  ]);

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

  const post = await PostModel.create({
    title: "Post inicial",
    content: "Conteúdo inicial",
    summary: "Resumo inicial",
    discipline: discipline._id,
    author: professor._id,
    status: status._id,
  });

  professorId = professor.id;
  studentId = student.id;
  disciplineId = discipline.id;
  statusId = status.id;
  postId = post.id;
});

afterAll(async () => {
  await disconnectDB();
  await mongoServer.stop();
});

describe("GET /posts", () => {
  it("deve listar os posts persistidos no MongoDB", async () => {
    const response = await request(app).get("/posts");

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      data: expect.arrayContaining([
        expect.objectContaining({
          _id: expect.any(String),
          title: expect.any(String),
          summary: expect.any(String),
        }),
      ]),
    });
  });
});

describe("GET /posts/:id", () => {
  it("deve retornar erro para id inválido", async () => {
    const response = await request(app).get("/posts/teste");

    expect(response.status).toBe(400);

    expect(response.body).toHaveProperty("message");
  });

  it("deve retornar um post pelo id", async () => {
    const response = await request(app).get(`/posts/${postId}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual(
      expect.objectContaining({
        _id: postId,
        title: "Post inicial",
      }),
    );
  });
});

describe("POST /posts", () => {
  it("deve criar post quando o autor possui email de professor", async () => {
    const response = await request(app).post("/posts").send({
      title: "Novo post",
      content: "Conteúdo do novo post",
      summary: "Resumo do novo post",
      disciplineId,
      authorId: professorId,
      statusId,
      series: "3º ano",
      semester: "1",
    });

    expect(response.status).toBe(201);
    expect(response.body.data).toEqual(
      expect.objectContaining({
        title: "Novo post",
      }),
    );
  });

  it("deve retornar 400 quando o body vier vazio", async () => {
    const response = await request(app)
      .post("/posts")
      .set("Content-Type", "application/json")
      .send();

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Body da requisição não informado");
  });

  it("deve bloquear criação para usuário fora do domínio professor", async () => {
    const response = await request(app).post("/posts").send({
      title: "Post inválido",
      content: "Conteúdo",
      summary: "Resumo",
      disciplineId,
      authorId: studentId,
      statusId,
    });

    expect(response.status).toBe(403);
    expect(response.body.message).toContain("@professor.com");
  });
});

describe("PUT /posts/:id", () => {
  it("deve atualizar um post existente", async () => {
    const response = await request(app).put(`/posts/${postId}`).send({
      title: "Post atualizado",
      summary: "Resumo atualizado",
    });

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual(
      expect.objectContaining({
        _id: postId,
        title: "Post atualizado",
        summary: "Resumo atualizado",
      }),
    );
  });
});

describe("DELETE /posts/:id", () => {
  it("deve remover um post existente", async () => {
    const response = await request(app).delete(`/posts/${postId}`);

    expect(response.status).toBe(204);

    const storedPost = await PostModel.findById(postId);
    expect(storedPost).toBeNull();
  });
});
