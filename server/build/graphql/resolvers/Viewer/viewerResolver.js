import crypto from "crypto";
import { cookieOptions } from "../../..";
// import { IResolvers } from "@graphql-tools/utils";
import { Google } from "../../../lib/api/Google";
// Google авторизация
const logInViaGoogle = async (code, token, db, res) => {
    const { user } = await Google.logIn(code);
    if (!user) {
        throw new Error("Google login error");
    }
    // Name/Photo/Email lists
    const { names, photos, emailAddresses: emails } = user;
    const userNamesList = names && names.length ? names : null;
    const userPhotosList = photos && photos.length ? photos : null;
    const userEmailsList = emails && emails.length ? emails : null;
    // User Display Name
    const userName = userNamesList ? userNamesList[0].displayName : null;
    // User Id
    const userId = userNamesList &&
        userNamesList[0].metadata &&
        userNamesList[0].metadata.source
        ? userNamesList[0].metadata.source.id
        : null;
    // User Avatar
    const userAvatar = userPhotosList && userPhotosList[0].url ? userPhotosList[0].url : null;
    // User Email
    const userEmail = userEmailsList && userEmailsList[0].value ? userEmailsList[0].value : null;
    if (!userId || !userName || !userAvatar || !userEmail) {
        throw new Error("Google login error");
    }
    const updateRes = await db.users.findOneAndUpdate({ _id: userId }, {
        $set: {
            name: userName,
            avatar: userAvatar,
            contact: userEmail,
            token,
        },
    });
    let viewer = updateRes.value;
    if (!viewer) {
        const { insertedId } = await db.users.insertOne({
            _id: userId,
            token,
            name: userName,
            avatar: userAvatar,
            contact: userEmail,
            income: 0,
            bookings: [],
            listings: [],
        });
        viewer = await db.users.findOne({ _id: insertedId });
    }
    res.cookie("viewer", userId, {
        ...cookieOptions,
        maxAge: 365 * 24 * 60 * 60 * 1000,
    });
    // мой костыль. null убирает. В курсе написах так код, подбивать не собираюсь.
    if (viewer)
        return viewer;
};
// Когда уже есть куки, которые приходят в реквестве с клиента
const logInViaCookie = async (token, db, req, res) => {
    const updateRes = await db.users.findOneAndUpdate({
        _id: req.signedCookies.viewer,
    }, { $set: { token } });
    const viewer = updateRes.value;
    if (!viewer) {
        res.clearCookie("viewer", cookieOptions);
    }
    else {
        return viewer;
    }
};
// :IResolvers удалил возвращаемый тип, мб устарело
export const viewerResolvers = {
    Query: {
        authUrl: () => {
            try {
                return Google.authUrl;
            }
            catch (error) {
                throw new Error(`Failed to query Google auth Url: ${error}`);
            }
        },
    },
    Mutation: {
        logIn: async (_root, { input }, { db, req, res }) => {
            try {
                const code = input ? input.code : null;
                // Сделал проверку, ибо был баг не знаю из-за чего, что токен с реквеста потом не учитывался, и проверку на поиск в БД не проходило
                // Толком не знаю подводных, мб не безопастно.
                const token = req.get("X-CSRF-TOKEN") || crypto.randomBytes(16).toString("hex");
                const viewer = code
                    ? await logInViaGoogle(code, token, db, res)
                    : await logInViaCookie(token, db, req, res);
                if (!viewer)
                    return { didRequest: true };
                return {
                    _id: viewer._id,
                    token: viewer.token,
                    avatar: viewer.avatar,
                    walletId: viewer.walletId,
                    didRequest: true,
                };
            }
            catch (error) {
                throw new Error(`Failed to log in: ${error}`);
            }
        },
        logOut: (_root, _args, { res }) => {
            try {
                res.clearCookie("viewer", cookieOptions);
                return { didRequest: true };
            }
            catch (error) {
                throw new Error(`Failed to log out: ${error}`);
            }
        },
    },
    Viewer: {
        id: (viewer) => {
            return viewer._id;
        },
        hasWallet: (viewer) => {
            return viewer.walletId ? true : undefined;
        },
    },
};
//# sourceMappingURL=viewerResolver.js.map