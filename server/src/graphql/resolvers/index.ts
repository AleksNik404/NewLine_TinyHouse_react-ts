import { mergeResolvers } from "@graphql-tools/merge";
import { viewerResolvers } from "./Viewer";

export const resolvers = mergeResolvers([viewerResolvers]);
