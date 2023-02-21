import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import { ApolloServer } from "@apollo/server";
import http from "http";
import { expressMiddleware } from "@apollo/server/express4";
import { Application } from "express-serve-static-core";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { resolvers, typeDefs } from "./graphql";
import { connectDB } from "./database";
import cookieParser from "cookie-parser";

export const cookieOptions = {
  httpOnly: true,
  sameSite: true,
  signed: true,
  secure: process.env.NODE_ENV === "development" ? false : true,
};

const mount = async (app: Application) => {
  const db = await connectDB();
  const httpServer = http.createServer(app);

  app.use(cookieParser(process.env.SECRET));

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  app.use(
    "/api",
    express.json(),
    expressMiddleware(server, {
      context: async ({ req, res }) => ({ db, req, res }),
    })
  );

  // app.listen(Number(process.env.PORT));

  // const { url } =
  // await startStandaloneServer(server, {
  //   context: async ({ req, res }) => {
  //     return { db, req, res };
  //   },
  //   listen: { port: Number(process.env.PORT) },
  // });

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: Number(process.env.PORT) }, resolve)
  );
};

mount(express());
