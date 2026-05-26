import { NextFunction, Request, Response } from "express";
import {
  createPost,
  deletePost,
  getAllPosts,
  getPostById,
  updatePost,
} from "../services/posts.services";

// Bloco: normaliza o parâmetro id para compatibilidade com a tipagem do Express 5.
const getRouteId = (idParam: string | string[]): string => {
  return Array.isArray(idParam) ? idParam[0] : idParam;
};

// Bloco: controller de listagem dos posts.
export const listPosts = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const posts = await getAllPosts();

    return res.status(200).json({
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

// Bloco: controller de busca de um post específico por id.
export const showPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await getPostById(getRouteId(req.params.id));

    return res.status(200).json({
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

// Bloco: controller de criação de posts.
export const storePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await createPost(req.body);

    return res.status(201).json({
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

// Bloco: controller de atualização parcial ou completa do post existente.
export const updatePostById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await updatePost(getRouteId(req.params.id), req.body);

    return res.status(200).json({
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

// Bloco: controller de remoção do post pelo id informado.
export const removePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deletePost(getRouteId(req.params.id));

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};
