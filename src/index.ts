import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";

import express from "express";
import { schema } from "./graphql";

const app = express();
const port = 9000;
const server = new ApolloServer({ schema });

await server.start();

app.use("/api", express.json(), expressMiddleware(server));

app.listen(port);
