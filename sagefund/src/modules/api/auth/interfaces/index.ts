import { User, UserType, WalletSetupStatus } from "@prisma/client";
import { Request } from "express";
import { UserSigInDto } from "../dtos";
import { Optional } from "@/utils";

export interface RequestWithUser extends Request {
    user: User;
}

export interface DataStoredInToken {
    sub: string;
}

export interface LoginMeta {
    isWalletCreated: boolean;
    userType: UserType;
    transactionPin: string;
    walletSetupStatus: WalletSetupStatus;
}

export interface SignupResponseData {
    accessToken: string;
}
export interface LoginResponseData extends SignupResponseData {
    meta: string;
}

export enum LoginPlatform {
    ADMIN = "ADMIN",
    USER = "USER",
}

export type SignInOptions = Optional<UserSigInDto, "appType">;

export interface UserNameType {
    firstName: string;
    lastName: string;
}
