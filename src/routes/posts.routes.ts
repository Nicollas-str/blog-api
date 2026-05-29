import { Router } from "express";
import {
  listPosts,
  removePost,
  showPost,
  storePost,
  updatePostById,
} from "../controllers/posts.controller";
import { validate } from "../middlewares/validate.middleware";
import { createPostSchema } from "../schemas/posts.schema";

// Bloco: rotas principais do recurso posts com operações CRUD.
const postsRoutes = Router();

postsRoutes.get("/", listPosts);
postsRoutes.post("/", validate(createPostSchema), storePost);
postsRoutes.get("/:id", showPost);
postsRoutes.put("/:id", validate(createPostSchema), updatePostById);
postsRoutes.delete("/:id", removePost);

export default postsRoutes;
