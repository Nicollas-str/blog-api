import mongoose, { Document, Schema } from "mongoose";

// Bloco: contrato do documento de disciplina associado aos posts.
export interface IDiscipline extends Document {
  label: string;
  order: number;
  isActive: boolean;
}

// Bloco: schema da disciplina com nome, ordem de exibição e flag de ativação.
const DisciplineSchema = new Schema<IDiscipline>(
  {
    label: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    order: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    versionKey: false,
  },
);

// Bloco: model Mongoose responsável pela coleção de disciplinas.
const DisciplineModel = mongoose.model<IDiscipline>("Discipline", DisciplineSchema);

export default DisciplineModel;