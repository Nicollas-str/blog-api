import { z } from "zod";

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "ID inválido do MongoDB");

export const createPostSchema = z
  .object({
    title: z.string().trim().min(5).max(100).meta({
      description: "Título do post",
      example: "Meu primeiro post",
    }),
    content: z.string().trim().min(10).meta({
      description: "Conteúdo completo do post",
      example: "Aqui vai o corpo do texto do post...",
    }),
    summary: z.string().trim().min(10).max(300).meta({
      description: "Resumo do post",
      example: "Uma breve introdução sobre o assunto abordado.",
    }),
    imageUrl: z.url().optional().meta({
      description: "URL da imagem de capa (opcional)",
      example: "https://exemplo.com/imagem.jpg",
    }),
    series: z.string().trim().optional().meta({
      description: "Série/Ano letivo relacionado (opcional)",
      example: "3º Ano Ensino Médio",
    }),
    semester: z.string().trim().meta({
      description: "Semestre letivo",
      example: "1",
    }),
    discipline: objectIdSchema.meta({
      description: "ID da Disciplina relacionada",
      example: "60d5ecb8b392d21534c32b12",
    }),
    author: objectIdSchema.meta({
      description: "ID do Usuário autor do post",
      example: "60d5ecb8b392d21534c32b11",
    }),
    status: objectIdSchema.meta({
      description: "ID do Status da postagem",
      example: "60d5ecb8b392d21534c32b13",
    }),
  })
  .meta({
    id: "CreatePost",
    description: "Schema de criação de post sincronizado com o Banco",
  });

export const updatePartialPostSchema = createPostSchema.partial().meta({
  id: "UpdatePartialPost",
  description: "Schema de atualização parcial de post",
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePartialPostInput = z.infer<typeof updatePartialPostSchema>;
