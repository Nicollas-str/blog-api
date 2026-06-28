import { NextFunction, Request, Response } from "express";
import { getHealthStatus } from "../services/health.services";

export const showHealth = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { httpStatus, payload } = getHealthStatus();

    return res.status(httpStatus).json(payload);
  } catch (error) {
    next(error);
  }
};
