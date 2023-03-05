import { authorize } from "../../../lib/utils/utils";
export const userResolvers = {
    Query: {
        user: async (_root, { id }, { db, req }) => {
            try {
                const user = await db.users.findOne({ _id: id });
                if (!user) {
                    throw new Error("user can't be found");
                }
                const viewer = await authorize(db, req);
                if (viewer && viewer._id === user._id) {
                    user.authorized = true;
                }
                return user;
            }
            catch (error) {
                throw new Error(`Failed to query userL ${error}`);
            }
        },
    },
    User: {
        id: (user) => {
            return user._id;
        },
        hasWallet: (user) => {
            return Boolean(user.walletId);
        },
        income: (user) => {
            return user.authorized ? user.income : null;
        },
        bookings: async (user, { limit, page }, { db }) => {
            try {
                if (!user.authorized) {
                    return null;
                }
                const data = {
                    total: 0,
                    result: [],
                };
                let cursor = db.bookings.find({
                    _id: { $in: user.bookings },
                });
                cursor.skip(page > 0 ? (page - 1) * limit : 0);
                cursor = cursor.limit(limit);
                data.total = await cursor.count();
                data.result = await cursor.toArray();
                return data;
            }
            catch (error) {
                throw new Error(`Failed to query user bookings: ${error}`);
            }
        },
        listings: async (user, { limit, page }, { db }) => {
            try {
                const data = {
                    total: 0,
                    result: [],
                };
                let cursor = db.listings.find({
                    _id: { $in: user.listings },
                });
                cursor.skip(page > 0 ? (page - 1) * limit : 0);
                cursor = cursor.limit(limit);
                data.total = await cursor.count();
                data.result = await cursor.toArray();
                return data;
            }
            catch (error) {
                throw new Error(`Failed to query user listings: ${error}`);
            }
        },
    },
};
//# sourceMappingURL=userResolver.js.map