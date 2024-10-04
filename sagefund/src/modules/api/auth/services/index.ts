import { forwardRef, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { SignUpDto, SignInDto, UserSigInDto } from "../dtos";
import { DuplicateUserException } from "@/modules/api/user";
import * as bcrypt from "bcryptjs";
import { Prisma, Status, UserType, WalletSetupStatus } from "@prisma/client";
import {
    AuthGenericException,
    InvalidCredentialException,
    UserAccountDisabledException,
} from "../errors";
import { ApiResponse, buildResponse } from "@/utils/api-response-util";
import { PrismaService } from "@/modules/core/prisma/services";
import { encrypt, formatName, generateId } from "@/utils";
import {
    LoginMeta,
    LoginPlatform,
    LoginResponseData,
    SignInOptions,
    SignupResponseData,
} from "../interfaces";
import { WalletService } from "../../wallet/services";

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private prisma: PrismaService,
        @Inject(forwardRef(() => WalletService))
        private walletService: WalletService
    ) {}

    async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }

    async comparePassword(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash);
    }

    validateUserAccount(userType: UserType) {
        const userTypes: UserType[] = [UserType.CUSTOMER];

        if (!userTypes.includes(userType)) {
            throw new InvalidCredentialException(
                "Incorrect email or password",
                HttpStatus.UNAUTHORIZED
            );
        }
    }

    async signUp(
        options: SignUpDto,
        ip: string
    ): Promise<ApiResponse<SignupResponseData>> {
        const user = await this.prisma.user.findUnique({
            where: { email: options.email.trim() },
        });
        if (user) {
            throw new DuplicateUserException(
                "An account already exist with this email. Please login",
                HttpStatus.BAD_REQUEST
            );
        }

        const hashedPassword = await this.hashPassword(options.password);

        const createUserOptions: Prisma.UserUncheckedCreateInput = {
            email: options.email,
            userType: UserType.CUSTOMER,
            identifier: generateId({ type: "identifier" }),
            password: hashedPassword,
            ipAddress: ip,
            firstName: formatName(options.firstName),
            lastName: formatName(options.lastName),
        };

        const createdUser = await this.prisma.user.create({
            data: createUserOptions,
        });

        //setup user account wallet
        await this.walletService.createWallet(createdUser.id);

        await this.prisma.user.update({
            where: { id: createdUser.id },
            data: {
                isWalletCreated: true,
                walletSetupStatus: WalletSetupStatus.ACTIVE,
            },
        });

        const accessToken = await this.jwtService.signAsync({
            sub: createdUser.identifier,
        });

        return buildResponse({
            message: "Account successfully created",
            data: { accessToken },
        });
    }

    async signIn(
        options: SignInOptions,
        loginPlatform: LoginPlatform
    ): Promise<ApiResponse<LoginResponseData>> {
        const user = await this.prisma.user.findUnique({
            where: {
                email: options.email,
            },
            select: {
                identifier: true,
                password: true,
                isWalletCreated: true,
                userType: true,
                transactionPin: true,
                walletSetupStatus: true,
                status: true,
            },
        });

        if (!user) {
            throw new InvalidCredentialException(
                "Incorrect email or password",
                HttpStatus.UNAUTHORIZED
            );
        }

        if (user.status == Status.INACTIVE) {
            throw new UserAccountDisabledException(
                "Account is disabled. Kindly contact customer support",
                HttpStatus.BAD_REQUEST
            );
        }

        switch (loginPlatform) {
            case LoginPlatform.USER: {
                this.validateUserAccount(user.userType);
                break;
            }

            default: {
                throw new AuthGenericException(
                    "Invalid login platform",
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            }
        }

        const isValidPassword = await this.comparePassword(
            options.password,
            user.password
        );

        if (!isValidPassword) {
            throw new InvalidCredentialException(
                "Incorrect email or password",
                HttpStatus.UNAUTHORIZED
            );
        }

        await this.prisma.user.update({
            where: {
                identifier: user.identifier,
            },
            data: {
                lastLogin: new Date(),
                loginCount: {
                    increment: 1,
                },
            },
        });

        const accessToken = await this.jwtService.signAsync({
            sub: user.identifier,
        });

        const loginMeta: LoginMeta = {
            isWalletCreated: user.isWalletCreated,
            userType: user.userType,
            transactionPin: user.transactionPin,
            walletSetupStatus: user.walletSetupStatus,
        };

        return buildResponse({
            message: "Login successful",
            data: {
                accessToken,
                meta: encrypt(loginMeta),
            },
        });
    }

    async userSignIn(
        options: UserSigInDto
    ): Promise<ApiResponse<LoginResponseData>> {
        return await this.signIn(options, LoginPlatform.USER);
    }

    async adminSignIn(
        options: SignInDto,
        ip: string
    ): Promise<ApiResponse<LoginResponseData>> {
        const u = await this.prisma.user.findUnique({
            where: { email: options.email },
        });
        if (u) {
            await this.prisma.user.update({
                where: {
                    email: options.email,
                },
                data: {
                    ipAddress: ip,
                },
            });
        }

        return await this.signIn(options, LoginPlatform.ADMIN);
    }
}
