import { Prisma } from "@prisma/client";

export interface CreateUser {
    firstName: string;
}

export interface ClientDataInterface {
    ipAddress: string;
}

export type UserWithSelectFields = Prisma.UserGetPayload<{
    select: {
        id: true;
        firstName: true;
        lastName: true;
        username: true;
        identifier: true;
        macainId: true;
        email: true;
        phone: true;
        userAccountStatus: true;
    };
}>;
