import { Router } from "express";
import {
	listPosts,
	removePost,
	showPost,
	storePost,
	updatePostById,
} from "../controllers/posts.controller";

// Bloco: rotas principais do recurso posts com operações CRUD.
const postsRoutes = Router();

postsRoutes.get("/", listPosts);
postsRoutes.post("/", storePost);
postsRoutes.get("/:id", showPost);
postsRoutes.put("/:id", updatePostById);
postsRoutes.delete("/:id", removePost);

export default postsRoutes;
