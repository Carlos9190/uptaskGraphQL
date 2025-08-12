import mongoose, { Schema, Document, PopulatedDoc, Types } from "mongoose";
import { IUser } from "./User";

export interface IProject extends Document {
  name: string;
  creator: PopulatedDoc<IUser & Document>;
  created: number;
}

const projectSchema: Schema = new Schema({
  name: {
    type: String,
    require: true,
    trim: true,
  },
  creator: {
    type: Types.ObjectId,
    ref: "User",
  },
  created: {
    type: Date,
    default: Date.now(),
  },
});

const Project = mongoose.model<IProject>("Project", projectSchema);
export default Project;
