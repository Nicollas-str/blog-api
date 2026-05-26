import { Types } from "mongoose";

// Bloco: tipos usados pelo fallback local para reproduzir o contrato da API sem MongoDB.
export interface MemoryUser {
  _id: string;
  name: string;
  username: string;
  email: string;
  isActive: boolean;
}

export interface MemoryDiscipline {
  _id: string;
  label: string;
  order: number;
  isActive: boolean;
}

export interface MemoryStatus {
  _id: string;
  label: string;
  order: number;
  isActive: boolean;
}

export interface MemoryPost {
  _id: string;
  title: string;
  content: string;
  summary: string;
  imageUrl?: string;
  series?: string;
  semester?: string;
  discipline: MemoryDiscipline;
  author: Pick<MemoryUser, "_id" | "name" | "username" | "email">;
  status: Pick<MemoryStatus, "_id" | "label" | "order">;
  createDate: string;
  updateDate: string;
}

interface MemoryStore {
  users: MemoryUser[];
  disciplines: MemoryDiscipline[];
  statuses: MemoryStatus[];
  posts: MemoryPost[];
}

// Bloco: gera ObjectIds válidos para que os testes manuais usem o mesmo formato do MongoDB.
const createId = (): string => new Types.ObjectId().toString();

// Bloco: monta a massa inicial de usuários, catálogos e posts para o modo local.
const createInitialStore = (): MemoryStore => {
  // Dados base para uso local quando MongoDB e Docker não estão disponíveis.
  const professorId = createId();
  const studentId = createId();
  const mathId = createId();
  const physicsId = createId();
  const publishedId = createId();
  const draftId = createId();
  const now = new Date().toISOString();

  const users: MemoryUser[] = [
    {
      _id: professorId,
      name: "Ana Professora",
      username: "ana.prof",
      email: "ana@professor.com",
      isActive: true,
    },
    {
      _id: studentId,
      name: "Carlos Aluno",
      username: "carlos.aluno",
      email: "carlos@aluno.com",
      isActive: true,
    },
  ];

  const disciplines: MemoryDiscipline[] = [
    { _id: mathId, label: "Matemática", order: 1, isActive: true },
    { _id: physicsId, label: "Física", order: 2, isActive: true },
  ];

  const statuses: MemoryStatus[] = [
    { _id: publishedId, label: "Publicado", order: 1, isActive: true },
    { _id: draftId, label: "Rascunho", order: 2, isActive: true },
  ];

  const posts: MemoryPost[] = [
    {
      _id: createId(),
      title: "Introdução a Funções",
      content: "Conteúdo completo sobre funções do primeiro grau.",
      summary: "Resumo sobre funções do primeiro grau.",
      imageUrl: "https://images.example.com/posts/funcoes.png",
      series: "1º ano",
      semester: "1",
      discipline: disciplines[0],
      author: {
        _id: users[0]._id,
        name: users[0].name,
        username: users[0].username,
        email: users[0].email,
      },
      status: {
        _id: statuses[0]._id,
        label: statuses[0].label,
        order: statuses[0].order,
      },
      createDate: now,
      updateDate: now,
    },
  ];

  return { users, disciplines, statuses, posts };
};

// Bloco: mantém o estado em memória compartilhado enquanto a API estiver em execução.
let memoryStore: MemoryStore = createInitialStore();

export const resetMemoryStore = (): void => {
  // Reinicia o catálogo em memória a cada boot para deixar os testes previsíveis.
  memoryStore = createInitialStore();
};

// Bloco: consultas do catálogo local usadas por serviços e controllers no modo em memória.
export const getMemoryUsers = (): MemoryUser[] => memoryStore.users;

export const getMemoryDisciplines = (): MemoryDiscipline[] => memoryStore.disciplines;

export const getMemoryStatuses = (): MemoryStatus[] => memoryStore.statuses;

export const getMemoryPosts = (): MemoryPost[] => memoryStore.posts;

// Bloco: buscas pontuais por id para validar referências sem acessar o MongoDB.
export const findMemoryUserById = (id: string): MemoryUser | undefined =>
  memoryStore.users.find((user) => user._id === id);

export const findMemoryDisciplineById = (id: string): MemoryDiscipline | undefined =>
  memoryStore.disciplines.find((discipline) => discipline._id === id);

export const findMemoryStatusById = (id: string): MemoryStatus | undefined =>
  memoryStore.statuses.find((status) => status._id === id);

export const findMemoryPostById = (id: string): MemoryPost | undefined =>
  memoryStore.posts.find((post) => post._id === id);

// Bloco: operações de escrita do fallback local para criar, atualizar e remover posts.
export const createMemoryPost = (
  post: Omit<MemoryPost, "_id" | "createDate" | "updateDate">,
): MemoryPost => {
  // Gera metadados equivalentes aos timestamps do schema persistido.
  const now = new Date().toISOString();
  const createdPost: MemoryPost = {
    ...post,
    _id: createId(),
    createDate: now,
    updateDate: now,
  };

  memoryStore.posts = [createdPost, ...memoryStore.posts];

  return createdPost;
};

export const updateMemoryPost = (
  id: string,
  updater: (post: MemoryPost) => MemoryPost,
): MemoryPost | undefined => {
  // Localiza o item atual para aplicar a mutação recebida do serviço de posts.
  const index = memoryStore.posts.findIndex((post) => post._id === id);

  if (index === -1) {
    return undefined;
  }

  const updatedPost = updater(memoryStore.posts[index]);
  memoryStore.posts[index] = {
    ...updatedPost,
    // Atualiza a data para manter o comportamento próximo ao timestamps do Mongoose.
    updateDate: new Date().toISOString(),
  };

  return memoryStore.posts[index];
};

export const deleteMemoryPost = (id: string): boolean => {
  // Remove o post do array e retorna se houve exclusão real.
  const initialLength = memoryStore.posts.length;
  memoryStore.posts = memoryStore.posts.filter((post) => post._id !== id);
  return memoryStore.posts.length < initialLength;
};