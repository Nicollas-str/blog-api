import { Request, Response, NextFunction } from "express";
import { z } from "zod";

const ID_FIELDS = ["disciplineId", "authorId", "statusId"];

const FIELD_LABELS: Record<string, string> = {
  title: "título",
  content: "conteúdo",
  summary: "resumo",
  series: "série",
  semester: "semestre",
  disciplineId: "disciplineId",
  authorId: "authorId",
  statusId: "statusId",
};

export function validate(schema: z.ZodSchema) {
  return function (req: Request, res: Response, next: NextFunction): void {
    if (!req.body || Object.keys(req.body).length === 0) {
      res.status(400).json({ status: 400, message: "Body da requisição não informado" });
      return;
    }

    const result = schema.safeParse(req.body);

    if (!result.success) {
      const issues = result.error.issues;

      let imageUrlIssue = null;
      let invalidIdIssue = null;
      let missingFieldIssue = null;

      for (const issue of issues) {
        const fieldName = String(issue.path[0]);

        if (fieldName === "imageUrl" && imageUrlIssue === null) {
          imageUrlIssue = issue;
        }

        if (ID_FIELDS.includes(fieldName) && issue.message === "ID inválido do MongoDB" && invalidIdIssue === null) {
          invalidIdIssue = issue;
        }

        if (issue.path.length > 0 && missingFieldIssue === null) {
          missingFieldIssue = issue;
        }
      }

      let message = "Campos obrigatórios não informados";

      if (imageUrlIssue !== null) {
        message = "imageUrl deve ser uma URL válida";
      } else if (invalidIdIssue !== null) {
        message = "ID inválido do MongoDB";
      } else if (missingFieldIssue !== null) {
        const field = String(missingFieldIssue.path[0]);
        const label = FIELD_LABELS[field];

        if (label) {
          message = "Campo obrigatório não informado: " + label;
        } else {
          message = "Campo obrigatório não informado: " + field;
        }
      }

      res.status(400).json({ status: 400, message });
      return;
    }

    req.body = result.data;
    next();
  };
}
