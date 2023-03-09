import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import { ApolloServer } from "@apollo/server";
import cookieParser from "cookie-parser";
import http from "http";

import { expressMiddleware } from "@apollo/server/express4";
import { Application } from "express-serve-static-core";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { resolvers, typeDefs } from "./graphql";
import { connectDB } from "./database";

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
    express.json({ limit: "2mb" }),
    expressMiddleware(server, {
      context: async ({ req, res }) => ({ db, req, res }),
    })
  );

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: Number(process.env.PORT) }, resolve)
  );
};

mount(express());
