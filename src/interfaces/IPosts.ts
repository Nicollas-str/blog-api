export interface IPostPayload {
  title: string;
  content: string;
  summary: string;
  imageUrl?: string;
  series?: string;
  semester?: string;
  disciplineId: string;
  authorId: string;
  statusId: string;
}
