import { config } from "dotenv";

import validate, {
    RequiredEnvironment,
    RequiredEnvironmentTypes,
} from "@boxpositron/vre";

import { ConfigOptions } from "cloudinary";
export * from "./constants";

config();

const runtimeEnvironment: RequiredEnvironment[] = [
    {
        name: "PORT",
        type: RequiredEnvironmentTypes.Number,
    },
    {
        name: "BASEURL",
        type: RequiredEnvironmentTypes.String,
    },
    {
        name: "DATABASE_URL",
        type: RequiredEnvironmentTypes.String,
    },
    {
        name: "ALLOWED_DOMAINS",
        type: RequiredEnvironmentTypes.String,
    },

    // secret
    {
        name: "JWT_SECRET",
        type: RequiredEnvironmentTypes.String,
    },

    //
    {
        name: "ENCRYPT_SECRET",
        type: RequiredEnvironmentTypes.String,
    },

    //cloud bucket
    {
        name: "PROFILE_DIR",
        type: RequiredEnvironmentTypes.String,
    },

    //server environment
    {
        name: "ENVIRONMENT",
        type: RequiredEnvironmentTypes.String,
    },


    //clodinary
    {
        name: "CLOUDINARY_CLOUD_NAME",
        type: RequiredEnvironmentTypes.String,
    },
    {
        name: "CLOUDINARY_API_KEY",
        type: RequiredEnvironmentTypes.String,
    },
    {
        name: "CLOUDINARY_API_SECRET",
        type: RequiredEnvironmentTypes.String,
    },
];

validate(runtimeEnvironment);

//app
export const allowedDomains =
    process.env.ALLOWED_DOMAINS && process.env.ALLOWED_DOMAINS.split(",");
export const isProduction: boolean = process.env.NODE_ENV === "production";
export const port: number = parseInt(process.env.PORT ?? "4000");

//jwt
export const jwtSecret: string = process.env.JWT_SECRET;

//encrypt
export const encryptSecret: string = process.env.ENCRYPT_SECRET;

export const appBaseUrl: string = process.env.BASEURL;

//prod deployment env
export const isProdEnvironment = process.env.ENVIRONMENT === "production";

export const frontendDevOrigin = [/^http:\/\/localhost:\d+$/];

interface StorageDirConfig {
    profile: string;
}


//cloudinary

export const cloudinaryConfig: ConfigOptions = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
};
