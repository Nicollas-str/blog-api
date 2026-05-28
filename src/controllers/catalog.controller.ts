import { NextFunction, Request, Response } from "express";
import { getAllDisciplines, getAllStatuses, getAllUsers } from "../services/catalog.services";

// Bloco: endpoint auxiliar para listar autores disponíveis no teste manual.
export const listUsers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await getAllUsers();
    return res.status(200).json({ data: users });
  } catch (error) {
    next(error);
  }
};

// Bloco: endpoint auxiliar para listar disciplinas e permitir seleção no Postman.
export const listDisciplines = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const disciplines = await getAllDisciplines();
    return res.status(200).json({ data: disciplines });
  } catch (error) {
    next(error);
  }
};

// Bloco: endpoint auxiliar para listar status de publicação disponíveis.
export const listStatuses = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const statuses = await getAllStatuses();
    return res.status(200).json({ data: statuses });
  } catch (error) {
    next(error);
  }
};