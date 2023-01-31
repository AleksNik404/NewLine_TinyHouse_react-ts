import * as dotenv from "dotenv";
dotenv.config();

import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import express from "express";
// import { expressMiddleware } from "@apollo/server/express4";
// import http from "http";
// import cors from "cors";
import { Application } from "express-serve-static-core";

import { resolvers, typeDefs } from "./graphql";
import { connectDB } from "./database";

const mount = async (app: Application) => {
  // const httpServer = http.createServer(app);

  const db = await connectDB();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { url } = await startStandaloneServer(server, {
    context: async () => ({ db }),
    listen: { port: Number(process.env.PORT) },
  });
  // await server.start();

  // app.use(
  //   "/api",
  //   express.json(),
  //   expressMiddleware(server, {
  //     context: async () => ({ db }),
  //   })
  // );
};

mount(express());
