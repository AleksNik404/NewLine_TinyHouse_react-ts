import { mergeResolvers } from "@graphql-tools/merge";
import { bookingResolvers } from "./Bookings/bookingResolvers";
import { listingResolvers } from "./Listing/listingResolver";
import { userResolvers } from "./User/userResolver";
import { viewerResolvers } from "./Viewer/viewerResolver";
export const resolvers = mergeResolvers([
    viewerResolvers,
    userResolvers,
    bookingResolvers,
    listingResolvers,
]);
//# sourceMappingURL=index.js.map