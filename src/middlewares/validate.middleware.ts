import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const validate = (schema: z.ZodSchema) => (req: Request, res: Response, next: NextFunction): void => {
  if (!req.body || Object.keys(req.body).length === 0) {
    res.status(400).json({ status: 400, message: "Body da requisição não informado" });
    return;
  }

  const result = schema.safeParse(req.body);

  if (!result.success) {
    const message = result.error.issues[0].message;
    res.status(400).json({ status: 400, message });
    return;
  }

  req.body = result.data;
  next();
};
