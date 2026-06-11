import mongoose, { Document, Schema } from "mongoose";

export interface IStatus extends Document {
  label: string;
  order: number;
  isActive: boolean;
}

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

const StatusModel = mongoose.model<IStatus>("Status", StatusSchema);

export default StatusModel;