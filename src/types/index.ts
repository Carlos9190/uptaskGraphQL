import { Types } from "mongoose";

// User types
export type UserInput = {
  name: string;
  email: string;
  password: string;
};

export type CreateUserArgs = {
  input: UserInput;
};

export type AuthenticatedUser = {
  id: Types.ObjectId;
  email: string;
};

export type GraphQLContext = {
  user: AuthenticatedUser;
};

export type UserPayload = {
  id: Types.ObjectId;
  email: UserInput["email"];
};

// Project types
export type ProjectInput = {
  name: string;
};

export type CreateProjectArgs = {
  input: ProjectInput;
};

export type UpdateProjectArgs = {
  id: Types.ObjectId;
  input: ProjectInput;
};

// Task types
export type TaskInput = {
  name: string;
  project: Types.ObjectId;
  status: boolean;
};

export type CreateTaskArgs = {
  input: TaskInput;
};

export type UpdateTaskArgs = {
  id: Types.ObjectId;
  input: TaskInput;
  status: boolean;
};

export type GetTasksArgs = {
  input: TaskInput;
};
