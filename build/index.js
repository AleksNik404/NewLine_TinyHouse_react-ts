import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import { schema } from "./graphql";
const app = express();
const port = 9000;
const server = new ApolloServer({ schema });
// server.applyMiddleware({ app, path: "/api" });
await server.start();
app.use("/api", expressMiddleware(server));
app.listen(port);
// { typeDefs: "", resolvers: {} }
// // "start": "nodemon src/index.ts",
