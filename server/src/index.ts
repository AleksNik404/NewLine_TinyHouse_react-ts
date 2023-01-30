import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import { Application } from "express-serve-static-core";

import { resolvers, typeDefs } from "./graphql";
import { run } from "./database";

const mount = async (app: Application) => {
  const db = await run();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: Number(process.env.PORT) },
  });
  // await server.start();

  app.use(
    "/api",
    express.json(),
    expressMiddleware(server, {
      context: async () => ({ db }),
    })
  );
};

mount(express());
