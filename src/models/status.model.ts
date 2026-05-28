import mongoose, { Document, Schema } from "mongoose";

// Bloco: contrato do documento de status usado no fluxo editorial dos posts.
export interface IStatus extends Document {
  label: string;
  order: number;
  isActive: boolean;
}

// Bloco: schema do status com rótulo, ordem e disponibilidade para uso.
const StatusSchema = new Schema<IStatus>(
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

// Bloco: model Mongoose da coleção de status.
const StatusModel = mongoose.model<IStatus>("Status", StatusSchema);

export default StatusModel;