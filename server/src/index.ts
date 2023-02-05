import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { Application } from "express-serve-static-core";

import { resolvers, typeDefs } from "./graphql";
import { connectDB } from "./database";

const mount = async (app: Application) => {
  const db = await connectDB();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  // const { url } =
  await startStandaloneServer(server, {
    context: async () => ({ db }),
    listen: { port: Number(process.env.PORT) },
  });
};

mount(express());
