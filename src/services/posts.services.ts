import { isValidObjectId, PopulateOptions } from "mongoose";
import DisciplineModel from "../models/disciplines.model";
import PostModel from "../models/posts.model";
import StatusModel from "../models/status.model";
import UserModel from "../models/users.model";
import IAppError from "../interfaces/IAppError";
import {
  createMemoryPost,
  deleteMemoryPost,
  findMemoryDisciplineById,
  findMemoryPostById,
  findMemoryStatusById,
  findMemoryUserById,
  getMemoryPosts,
  updateMemoryPost,
} from "./memory-data.service";

export interface PostPayload {
  title: string;
  content: string;
  summary: string;
  imageUrl?: string;
  series?: string;
  semester?: string;
  disciplineId: string;
  authorId: string;
  statusId: string;
}

export type PostUpdatePayload = Partial<PostPayload>;

// Bloco: constantes e helpers compartilhados pela regra de negócio dos posts.
const PROFESSOR_DOMAIN = "@professor.com";
const isMemoryMode = (): boolean => process.env.USE_IN_MEMORY_DB === "true";

const createAppError = (message: string, status: number): IAppError => {
  const error = new Error(message) as IAppError;
  error.status = status;
  return error;
};

const validateObjectId = (value: string, fieldName: string): void => {
  if (!isValidObjectId(value)) {
    throw createAppError(`${fieldName} inválido`, 400);
  }
};

const ensureProfessorAuthor = async (authorId: string) => {
  validateObjectId(authorId, "authorId");

  const author = await UserModel.findById(authorId);

  if (!author || !author.isActive) {
    throw createAppError("Autor não encontrado ou inativo", 404);
  }

  if (!author.email.endsWith(PROFESSOR_DOMAIN)) {
    throw createAppError("Apenas usuários com email @professor.com podem criar posts", 403);
  }

  return author;
};

const ensureActiveDiscipline = async (disciplineId: string) => {
  validateObjectId(disciplineId, "disciplineId");

  const discipline = await DisciplineModel.findById(disciplineId);

  if (!discipline || !discipline.isActive) {
    throw createAppError("Disciplina não encontrada ou inativa", 404);
  }

  return discipline;
};

const ensureActiveStatus = async (statusId: string) => {
  validateObjectId(statusId, "statusId");

  const status = await StatusModel.findById(statusId);

  if (!status || !status.isActive) {
    throw createAppError("Status não encontrado ou inativo", 404);
  }

  return status;
};

// Bloco: define os relacionamentos populados quando os posts vêm do MongoDB.
const postPopulate: PopulateOptions[] = [
  { path: "author", select: "name username email" },
  { path: "discipline", select: "label order" },
  { path: "status", select: "label order" },
];

// Bloco: leitura geral de posts com fallback para catálogo em memória.
export const getAllPosts = async () => {
  // Mantém o mesmo contrato da API mesmo quando o projeto roda sem MongoDB local.
  if (isMemoryMode()) {
    return getMemoryPosts();
  }

  return PostModel.find().populate(postPopulate).sort({ createDate: -1 });
};

// Bloco: busca individual de post com validação do id informado na rota.
export const getPostById = async (id: string) => {
  validateObjectId(id, "id");

  if (isMemoryMode()) {
    const post = findMemoryPostById(id);

    if (!post) {
      throw createAppError("Post não encontrado", 404);
    }

    return post;
  }

  const post = await PostModel.findById(id).populate(postPopulate);

  if (!post) {
    throw createAppError("Post não encontrado", 404);
  }

  return post;
};

// Bloco: criação de posts com validação de campos e autorização por domínio de email.
export const createPost = async (payload?: PostPayload) => {
  if (!payload || Object.keys(payload).length === 0) {
    throw createAppError("Body da requisição não informado", 400);
  }

  const { title, content, summary, imageUrl, series, semester, disciplineId, authorId, statusId } = payload;

  if (!title || !content || !summary || !disciplineId || !authorId || !statusId) {
    throw createAppError("Campos obrigatórios não informados", 400);
  }

  if (isMemoryMode()) {
    // No modo local, as referências são resolvidas no catálogo em memória para permitir testes no Postman.
    validateObjectId(authorId, "authorId");
    validateObjectId(disciplineId, "disciplineId");
    validateObjectId(statusId, "statusId");

    const author = findMemoryUserById(authorId);
    const discipline = findMemoryDisciplineById(disciplineId);
    const status = findMemoryStatusById(statusId);

    if (!author || !author.isActive) {
      throw createAppError("Autor não encontrado ou inativo", 404);
    }

    if (!author.email.endsWith(PROFESSOR_DOMAIN)) {
      throw createAppError("Apenas usuários com email @professor.com podem criar posts", 403);
    }

    if (!discipline || !discipline.isActive) {
      throw createAppError("Disciplina não encontrada ou inativa", 404);
    }

    if (!status || !status.isActive) {
      throw createAppError("Status não encontrado ou inativo", 404);
    }

    return createMemoryPost({
      title,
      content,
      summary,
      imageUrl,
      series,
      semester,
      discipline,
      author: {
        _id: author._id,
        name: author.name,
        username: author.username,
        email: author.email,
      },
      status: {
        _id: status._id,
        label: status.label,
        order: status.order,
      },
    });
  }

  await Promise.all([
    // Em produção, a criação depende de autor, disciplina e status válidos no MongoDB.
    ensureProfessorAuthor(authorId),
    ensureActiveDiscipline(disciplineId),
    ensureActiveStatus(statusId),
  ]);

  const post = await PostModel.create({
    title,
    content,
    summary,
    imageUrl,
    series,
    semester,
    discipline: disciplineId,
    author: authorId,
    status: statusId,
  });

  return PostModel.findById(post._id).populate(postPopulate);
};

// Bloco: atualização de posts reaplicando as validações de referência e autorização.
export const updatePost = async (id: string, payload: PostUpdatePayload) => {
  validateObjectId(id, "id");

  if (isMemoryMode()) {
    // O update reaplica a mesma regra de autorização para manter o comportamento igual ao persistido.
    const currentPost = findMemoryPostById(id);

    if (!currentPost) {
      throw createAppError("Post não encontrado", 404);
    }

    const author = payload.authorId
      ? findMemoryUserById(payload.authorId)
      : findMemoryUserById(currentPost.author._id);
    const discipline = payload.disciplineId
      ? findMemoryDisciplineById(payload.disciplineId)
      : currentPost.discipline;
    const status = payload.statusId
      ? findMemoryStatusById(payload.statusId)
      : findMemoryStatusById(currentPost.status._id);

    if (!author || !author.isActive) {
      throw createAppError("Autor não encontrado ou inativo", 404);
    }

    if (!author.email.endsWith(PROFESSOR_DOMAIN)) {
      throw createAppError("Apenas usuários com email @professor.com podem criar posts", 403);
    }

    if (!discipline || !discipline.isActive) {
      throw createAppError("Disciplina não encontrada ou inativa", 404);
    }

    if (!status || !status.isActive) {
      throw createAppError("Status não encontrado ou inativo", 404);
    }

    const post = updateMemoryPost(id, (storedPost) => ({
      ...storedPost,
      title: payload.title ?? storedPost.title,
      content: payload.content ?? storedPost.content,
      summary: payload.summary ?? storedPost.summary,
      imageUrl: payload.imageUrl ?? storedPost.imageUrl,
      series: payload.series ?? storedPost.series,
      semester: payload.semester ?? storedPost.semester,
      discipline,
      author: {
        _id: author._id,
        name: author.name,
        username: author.username,
        email: author.email,
      },
      status: {
        _id: status._id,
        label: status.label,
        order: status.order,
      },
    }));

    if (!post) {
      throw createAppError("Post não encontrado", 404);
    }

    return post;
  }

  const post = await PostModel.findById(id);

  if (!post) {
    throw createAppError("Post não encontrado", 404);
  }

  if (payload.authorId) {
    await ensureProfessorAuthor(payload.authorId);
    post.set("author", payload.authorId);
  }

  if (payload.disciplineId) {
    await ensureActiveDiscipline(payload.disciplineId);
    post.set("discipline", payload.disciplineId);
  }

  if (payload.statusId) {
    await ensureActiveStatus(payload.statusId);
    post.set("status", payload.statusId);
  }

  if (payload.title !== undefined) {
    post.title = payload.title;
  }

  if (payload.content !== undefined) {
    post.content = payload.content;
  }

  if (payload.summary !== undefined) {
    post.summary = payload.summary;
  }

  if (payload.imageUrl !== undefined) {
    post.imageUrl = payload.imageUrl;
  }

  if (payload.series !== undefined) {
    post.series = payload.series;
  }

  if (payload.semester !== undefined) {
    post.semester = payload.semester;
  }

  await post.save();

  return PostModel.findById(post._id).populate(postPopulate);
};

// Bloco: remoção de posts tanto no MongoDB quanto no fallback local.
export const deletePost = async (id: string) => {
  validateObjectId(id, "id");

  if (isMemoryMode()) {
    const deleted = deleteMemoryPost(id);

    if (!deleted) {
      throw createAppError("Post não encontrado", 404);
    }

    return;
  }

  const deletedPost = await PostModel.findByIdAndDelete(id);

  if (!deletedPost) {
    throw createAppError("Post não encontrado", 404);
  }
};
