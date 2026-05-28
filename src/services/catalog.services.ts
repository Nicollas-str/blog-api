import DisciplineModel from "../models/disciplines.model";
import StatusModel from "../models/status.model";
import UserModel from "../models/users.model";
import {
  getMemoryDisciplines,
  getMemoryStatuses,
  getMemoryUsers,
} from "./memory-data.service";

// Bloco: chaveia entre catálogo persistido no MongoDB e catálogo local em memória.
const isMemoryMode = (): boolean => process.env.USE_IN_MEMORY_DB === "true";

// Bloco: lista usuários simplificados para seleção de autor no Postman.
export const getAllUsers = async () => {
  if (isMemoryMode()) {
    return getMemoryUsers();
  }

  return UserModel.find({}, { name: 1, username: 1, email: 1, isActive: 1 }).sort({ name: 1 });
};

// Bloco: lista disciplinas disponíveis para associação com posts.
export const getAllDisciplines = async () => {
  if (isMemoryMode()) {
    return getMemoryDisciplines();
  }

  return DisciplineModel.find().sort({ order: 1, label: 1 });
};

// Bloco: lista status disponíveis para seleção no fluxo de publicação.
export const getAllStatuses = async () => {
  if (isMemoryMode()) {
    return getMemoryStatuses();
  }

  return StatusModel.find().sort({ order: 1, label: 1 });
};