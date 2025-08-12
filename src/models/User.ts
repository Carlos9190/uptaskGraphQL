import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  register: number;
}

const userSchema: Schema = new Schema({
  name: {
    type: String,
    require: true,
    trim: true,
  },
  email: {
    type: String,
    require: true,
    lowercase: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    require: true,
    trim: true,
  },
  register: {
    type: Date,
    default: Date.now(),
  },
});

const User = mongoose.model<IUser>("User", userSchema);
export default User;
