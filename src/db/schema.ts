import { gql } from "apollo-server";

export const typeDefs = gql`
  type Token {
    token: String
  }

  type Project {
    name: String
    id: ID
  }

  type Task {
    name: String
    id: ID
    project: String
    status: Boolean
  }

  type Query {
    getProjects: [Project]

    getTasks(input: ProjectIDInput): [Task]
  }

  input ProjectIDInput {
    project: String!
  }

  input UserInput {
    name: String!
    email: String!
    password: String!
  }

  input AuthInput {
    email: String!
    password: String!
  }

  input ProjectInput {
    name: String!
  }

  input TaskInput {
    name: String!
    project: String!
  }

  type Mutation {
    # Users
    createUser(input: UserInput): String

    # Projects
    authenticateUser(input: AuthInput): Token
    createProject(input: ProjectInput): Project
    updateProject(id: ID!, input: ProjectInput): Project
    deleteProject(id: ID!): String

    # Tasks
    createTask(input: TaskInput): Task
    updateTask(id: ID!, input: TaskInput, status: Boolean): Task
    deleteTask(id: ID!): String
  }
`;
