import { ObjectId } from "mongodb";
import { authorize } from "../../../lib/utils/utils";
import { ListingsFilter, } from "./types";
import { Google } from "../../../lib/api/Google";
export const listingResolvers = {
    Query: {
        listing: async (_root, { id }, { db, req }) => {
            try {
                const listing = await db.listings.findOne({ _id: new ObjectId(id) });
                if (!listing)
                    throw new Error("listing can`t be found");
                const viewer = await authorize(db, req);
                if (viewer && viewer._id === listing.host) {
                    listing.authorized = true;
                }
                return listing;
            }
            catch (error) {
                throw new Error(`Filed to query listing: ${error}`);
            }
        },
        listings: async (_root, { location, filter, limit, page }, { db }) => {
            try {
                const query = {};
                const data = {
                    total: 0,
                    result: [],
                };
                if (location) {
                    const { country, admin, city } = await Google.geocode(location);
                    if (city)
                        query.city = city;
                    if (admin)
                        query.admin = admin;
                    if (country)
                        query.country = country;
                    else
                        throw new Error("no country found");
                }
                let cursor = db.listings.find(query);
                if (filter === ListingsFilter.PRICE_LOW_TO_HIGH) {
                    cursor = cursor.sort({ price: 1 });
                }
                if (filter === ListingsFilter.PRICE_HIGH_TO_LOW) {
                    cursor = cursor.sort({ price: -1 });
                }
                cursor = cursor.skip(page > 0 ? (page - 1) * limit : 0);
                cursor = cursor.limit(limit);
                data.total = await cursor.count();
                data.result = await cursor.toArray();
                return data;
            }
            catch (error) {
                throw new Error(`Failed to query listings: ${error}`);
            }
        },
    },
    Listing: {
        id: (listing) => {
            return listing._id.toString();
        },
        host: async (listing, _args, { db }) => {
            const host = await db.users.findOne({ _id: listing.host });
            if (!host)
                throw new Error("host can`t be found");
            return host;
        },
        bookingsIndex: (listing) => {
            return JSON.stringify(listing.bookingsIndex);
        },
        bookings: async (listing, { limit, page }, { db }) => {
            try {
                if (!listing.authorized) {
                    return null;
                }
                const data = {
                    total: 0,
                    result: [],
                };
                let cursor = db.bookings.find({
                    _id: { $in: listing.bookings },
                });
                cursor = cursor.skip(page > 0 ? (page - 1) * limit : 0);
                cursor = cursor.limit(limit);
                data.total = await cursor.count();
                data.result = await cursor.toArray();
                return data;
            }
            catch (error) {
                throw new Error(`Failed to query listing bookings: ${error}`);
            }
        },
    },
};
//# sourceMappingURL=listingResolver.js.map