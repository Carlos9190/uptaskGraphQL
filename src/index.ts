import { ApolloServer } from "apollo-server";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { typeDefs } from "./db/schema";
import { resolvers } from "./db/resolver";
import { connectDB } from "./config/db";
import { AuthenticatedUser } from "./types";

dotenv.config();
connectDB();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers["authorization"] || "";

    if (token) {
      try {
        const user = jwt.verify(
          token,
          process.env.SECRET!
        ) as AuthenticatedUser;
        return { user };
      } catch (error) {
        console.log(error);
      }
    }
  },
});

server.listen().then(({ url }) => {
  console.log(`Server working on ${url}`);
});
