import mongoose, { Schema, Document, PopulatedDoc, Types } from "mongoose";
import { IUser } from "./User";
import { IProject } from "./Project";

export interface ITask extends Document {
  name: string;
  creator: PopulatedDoc<IUser & Document>;
  created: number;
  project: PopulatedDoc<IProject & Document>;
  status: boolean;
}

const taskSchema: Schema = new Schema({
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
  project: {
    type: Types.ObjectId,
    ref: "Project",
  },
  status: {
    type: Boolean,
    default: false,
  },
});

const Task = mongoose.model<ITask>("Task", taskSchema);
export default Task;
