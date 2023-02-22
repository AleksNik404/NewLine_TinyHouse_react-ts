import { mergeResolvers } from "@graphql-tools/merge";
import { userResolvers } from "./User";
import { viewerResolvers } from "./Viewer";

export const resolvers = mergeResolvers([viewerResolvers, userResolvers]);
