import mongoose, { Document, Schema, Types } from "mongoose";

// Bloco: contrato do documento Post com referências para autor, disciplina e status.
export interface IPost extends Document {
  title: string;
  content: string;
  summary: string;
  imageUrl?: string;
  series?: string;
  semester?: string;
  discipline: Types.ObjectId;
  author: Types.ObjectId;
  status: Types.ObjectId;
  createDate: Date;
  updateDate: Date;
}

// Bloco: schema central dos posts, incluindo os relacionamentos via ObjectId.
const PostSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    summary: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    series: {
      type: String,
      trim: true,
    },
    semester: {
      type: String,
      trim: true,
    },
    discipline: {
      type: Schema.Types.ObjectId,
      ref: "Discipline",
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: Schema.Types.ObjectId,
      ref: "Status",
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: "createDate",
      updatedAt: "updateDate",
    },
    versionKey: false,
  },
);

// Bloco: model Mongoose da coleção principal de posts.
const PostModel = mongoose.model<IPost>("Post", PostSchema);

export default PostModel;
