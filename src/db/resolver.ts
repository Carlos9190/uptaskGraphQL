import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";
import {
  CreateProjectArgs,
  CreateTaskArgs,
  CreateUserArgs,
  GetTasksArgs,
  GraphQLContext,
  UpdateProjectArgs,
  UpdateTaskArgs,
  UserPayload,
} from "../types";
import Project from "../models/Project";
import Task from "../models/Task";

// Create and sign a JWT
const createToken = (payload: UserPayload) => {
  const token = jwt.sign(payload, process.env.SECRET!, {
    expiresIn: "180d",
  });

  return token;
};

export const resolvers = {
  Query: {
    getProjects: async (_: any, {}, ctx: GraphQLContext) => {
      const projects = await Project.find({ creator: ctx.user.id });

      return projects;
    },
    getTasks: async (_: any, { input }: GetTasksArgs, ctx: GraphQLContext) => {
      const tasks = await Task.find({ creator: ctx.user.id })
        .where("project")
        .equals(input.project);

      return tasks;
    },
  },
  Mutation: {
    createUser: async (_: any, { input }: CreateUserArgs) => {
      const { email, password } = input;

      const userExists = await User.findOne({ email });

      if (userExists) {
        throw new Error("User already registered");
      }

      try {
        // Hash password
        const salt = await bcrypt.genSalt(10);
        input.password = await bcrypt.hash(password, salt);

        // Register new user
        const newUser = new User(input);

        newUser.save();
        return "User successfully created";
      } catch (error) {
        console.log(error);
      }
    },
    authenticateUser: async (_: any, { input }: CreateUserArgs) => {
      const { email, password } = input;

      // Check wheter user exists
      const userExists = await User.findOne({ email });

      if (!userExists) {
        throw new Error("User not found");
      }

      // Check whether password is correct
      const correctPassword = await bcrypt.compare(
        password,
        userExists.password
      );

      if (!correctPassword) {
        throw new Error("Incorrect password");
      }

      // Allow access
      return {
        token: createToken({ id: userExists.id, email: userExists.email }),
      };
    },
    createProject: async (
      _: any,
      { input }: CreateProjectArgs,
      ctx: GraphQLContext
    ) => {
      try {
        const project = new Project(input);

        // Associate creator
        project.creator = ctx.user.id;

        // Save on DB
        const result = await project.save();
        return result;
      } catch (error) {
        console.log(error);
      }
    },
    updateProject: async (
      _: any,
      { id, input }: UpdateProjectArgs,
      ctx: GraphQLContext
    ) => {
      // Check whether project exists
      let project = await Project.findById(id);

      if (!project) {
        throw new Error("Project not found");
      }

      // Check whether that user is the creator
      if (project.creator?.toString() !== ctx.user.id.toString()) {
        throw new Error("Unauthorized");
      }

      // Save updated project
      project = await Project.findOneAndUpdate({ _id: id }, input, {
        new: true,
      });
      return project;
    },
    deleteProject: async (
      _: any,
      { id }: UpdateProjectArgs,
      ctx: GraphQLContext
    ) => {
      // Check whether project exists
      let project = await Project.findById(id);

      if (!project) {
        throw new Error("Project not found");
      }

      // Check whether that user is the creator
      if (project.creator?.toString() !== ctx.user.id.toString()) {
        throw new Error("Unauthorized");
      }

      // Delete project
      await Project.findOneAndDelete({ _id: id });

      return "Project successfully deleted";
    },
    createTask: async (
      _: any,
      { input }: CreateTaskArgs,
      ctx: GraphQLContext
    ) => {
      try {
        const task = new Task(input);
        task.creator = ctx.user.id;

        const result = await task.save();
        return result;
      } catch (error) {
        console.log(error);
      }
    },
    updateTask: async (
      _: any,
      { id, input, status }: UpdateTaskArgs,
      ctx: GraphQLContext
    ) => {
      // Check whether the task exists
      let task = await Task.findById(id);

      if (!task) {
        throw new Error("Task not found");
      }

      // Check whether that user is the creator
      if (task.creator?.toString() !== ctx.user.id.toString()) {
        throw new Error("Unauthorized");
      }

      // Status
      input.status = status;

      // Save updated task
      task = await Task.findOneAndUpdate({ _id: id }, input, { new: true });
      return task;
    },
    deleteTask: async (_: any, { id }: UpdateTaskArgs, ctx: GraphQLContext) => {
      // Check whether task exists
      let task = await Task.findById(id);

      if (!task) {
        throw new Error("Task not found");
      }

      // Check whether that user is the creator
      if (task.creator?.toString() !== ctx.user.id.toString()) {
        throw new Error("Unauthorized");
      }

      // Delete task
      await Task.findOneAndDelete({ _id: id });

      return "Task successfully deleted";
    },
  },
};
