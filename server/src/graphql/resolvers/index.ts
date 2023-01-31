import { mergeResolvers } from "@graphql-tools/merge";
import { listingResolvers } from "./Listing";

export const resolvers = mergeResolvers([listingResolvers]);
