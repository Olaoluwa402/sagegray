import { jwtSecret } from "@/config";
import {
    CanActivate,
    ExecutionContext,
    HttpStatus,
    Injectable,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import {
    AccountDeletedException,
    UserNotFoundException,
} from "@/modules/api/user";
import { UserService } from "../../user/services";
import {
    AuthTokenValidationException,
    InvalidAuthTokenException,
    PrismaNetworkException,
} from "../errors";
import { DataStoredInToken, RequestWithUser } from "../interfaces";
import logger from "moment-logger";
import { PrismaService } from "@/modules/core/prisma/services";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private userService: UserService,
        private prisma: PrismaService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest() as RequestWithUser;
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new InvalidAuthTokenException(
                "Authorization header is missing",
                HttpStatus.UNAUTHORIZED
            );
        }
        try {
            const payload: DataStoredInToken =
                await this.jwtService.verifyAsync(token, {
                    secret: jwtSecret,
                });

            const user = await this.prisma.user.findUnique({
                where: {
                    identifier: payload.sub,
                },
            });
            if (!user) {
                throw new UserNotFoundException(
                    "Your session is unauthorized",
                    HttpStatus.UNAUTHORIZED
                );
            }

            if (user.isDeleted) {
                throw new AccountDeletedException(
                    "Account not found",
                    HttpStatus.UNAUTHORIZED
                );
            }

            request.user = user;
        } catch (error) {
            logger.error(error);
            switch (true) {
                case error instanceof UserNotFoundException: {
                    throw error;
                }

                case error instanceof AccountDeletedException: {
                    throw error;
                }

                case error.name == "PrismaClientKnownRequestError": {
                    throw new PrismaNetworkException(
                        "Unable to process request. Please try again",
                        HttpStatus.SERVICE_UNAVAILABLE
                    );
                }

                default: {
                    throw new AuthTokenValidationException(
                        "Your session is unauthorized or expired",
                        HttpStatus.UNAUTHORIZED
                    );
                }
            }
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(" ") ?? [];
        return type === "Bearer" ? token : undefined;
    }
}
