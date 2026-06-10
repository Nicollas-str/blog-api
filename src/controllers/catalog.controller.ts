import { NextFunction, Request, Response } from "express";
import {
  createDiscipline,
  createStatus,
  createUser,
  deleteDiscipline,
  deleteStatus,
  deleteUser,
  getAllDisciplines,
  getAllStatuses,
  getAllUsers,
  updateDiscipline,
  updateStatus,
  updateUser,
} from "../services/catalog.services";

// ─────────────────────────────────── Usuários ──────────────────────────────────

export const listUsers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await getAllUsers();
    return res.status(200).json({ data: users });
  } catch (error) {
    next(error);
  }
};

export const storeUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await createUser(req.body);
    return res.status(201).json({ data: user });
  } catch (error) {
    next(error);
  }
};

export const updateUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await updateUser(req.params.id as string, req.body);
    return res.status(200).json({ data: user });
  } catch (error) {
    next(error);
  }
};

export const removeUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deleteUser(req.params.id as string);
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────── Disciplinas ──────────────────────────────────


export const listDisciplines = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const disciplines = await getAllDisciplines();
    return res.status(200).json({ data: disciplines });
  } catch (error) {
    next(error);
  }
};

export const storeDiscipline = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const discipline = await createDiscipline(req.body);
    return res.status(201).json({ data: discipline });
  } catch (error) {
    next(error);
  }
};

export const updateDisciplineById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const discipline = await updateDiscipline(req.params.id as string, req.body);
    return res.status(200).json({ data: discipline });
  } catch (error) {
    next(error);
  }
};

export const removeDiscipline = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deleteDiscipline(req.params.id as string);
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────── Status ──────────────────────────────────

export const listStatuses = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const statuses = await getAllStatuses();
    return res.status(200).json({ data: statuses });
  } catch (error) {
    next(error);
  }
};

export const storeStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const status = await createStatus(req.body);
    return res.status(201).json({ data: status });
  } catch (error) {
    next(error);
  }
};

export const updateStatusById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const status = await updateStatus(req.params.id as string, req.body);
    return res.status(200).json({ data: status });
  } catch (error) {
    next(error);
  }
};

export const removeStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deleteStatus(req.params.id as string);
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};
