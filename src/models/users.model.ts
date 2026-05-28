import mongoose, { Document, Schema } from "mongoose";

// Bloco: contrato do documento User persistido no MongoDB.
export interface IUser extends Document {
  name: string;
  username: string;
  password: string;
  email: string;
  mobilePhone?: string;
  externalId?: string;
  creationDate: Date;
  lastLogin?: Date;
  isActive: boolean;
}

// Bloco: schema do usuário com campos de autenticação, identificação e controle de acesso.
const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    mobilePhone: {
      type: String,
      trim: true,
    },
    externalId: {
      type: String,
      trim: true,
    },
    creationDate: {
      type: Date,
      default: Date.now,
    },
    lastLogin: {
      type: Date,
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

// Bloco: model Mongoose usado pelos serviços para consultas e persistência de usuários.
const UserModel = mongoose.model<IUser>("User", UserSchema);

export default UserModel;