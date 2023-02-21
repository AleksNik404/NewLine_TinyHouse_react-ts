import * as dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { Application } from "express-serve-static-core";

import { resolvers, typeDefs } from "./graphql";
import { connectDB } from "./database";
import cookieParser from "cookie-parser";
import { Database } from "./lib/types";

export const cookieOptions = {
  httpOnly: true,
  sameSite: true,
  signed: true,
  secure: process.env.NODE_ENV === "development" ? false : true,
};

interface Context {
  db: Database;
  req: Request;
  res: Response;
}

const mount = async (app: Application) => {
  const db = await connectDB();

  app.use(cookieParser(process.env.SECRET));

  const server = new ApolloServer<Context>({
    typeDefs,
    resolvers,
  });

  // const { url } =
  await startStandaloneServer(server, {
    context: async ({ req, res }) => ({ db, req, res }),
    listen: { port: Number(process.env.PORT) },
  });
};

mount(express());
