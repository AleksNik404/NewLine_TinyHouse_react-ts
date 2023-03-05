import { google } from "googleapis";
import * as dotenv from "dotenv";
import { Client, PlaceType2, } from "@googlemaps/google-maps-services-js";
dotenv.config();
const auth = new google.auth.OAuth2(process.env.G_CLIENT_ID, process.env.G_CLIENT_SECRET, process.env.G_CLIENT_URL_REDIRECT);
const client = new Client();
const parseAddress = (addressComponents) => {
    let country = null;
    let admin = null;
    let city = null;
    for (const component of addressComponents) {
        if (component.types.includes(PlaceType2.country)) {
            country = component.long_name;
        }
        if (component.types.includes(PlaceType2.administrative_area_level_1)) {
            admin = component.long_name;
        }
        if (component.types.includes(PlaceType2.locality) ||
            component.types.includes(PlaceType2.postal_town)) {
            city = component.long_name;
        }
    }
    return { country, admin, city };
};
export const Google = {
    authUrl: auth.generateAuthUrl({
        scope: [
            "https://www.googleapis.com/auth/userinfo.email",
            "https://www.googleapis.com/auth/userinfo.profile",
        ],
    }),
    logIn: async (code) => {
        const { tokens } = await auth.getToken(code);
        auth.setCredentials(tokens);
        const { data } = await google.people({ version: "v1", auth }).people.get({
            resourceName: "people/me",
            personFields: "emailAddresses,names,photos",
        });
        return { user: data };
    },
    geocode: async (address) => {
        const res = await client.geocode({
            params: {
                key: process.env.G_GEOCODE_KEY,
                address,
            },
        });
        if (res.status < 200 || res.status > 299) {
            throw new Error("failed to geocode address");
        }
        return parseAddress(res.data.results[0].address_components);
    },
};
//# sourceMappingURL=Google.js.map