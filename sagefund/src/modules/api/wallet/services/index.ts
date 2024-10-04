import { PrismaService } from "@/modules/core/prisma/services";
import { generateId } from "@/utils";
import { buildResponse } from "@/utils/api-response-util";
import { forwardRef, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { AuthService } from "../../auth/services";
import {
    InsufficientWalletBalanceException,
    WalletAlreadyCreatedException,
    WalletGenericException,
    WalletNotFoundException,
} from "../errors";
import { FundWalletDto, WalletToWalletTransferDto } from "../dtos";

@Injectable()
export class WalletService {
    constructor(
        private prisma: PrismaService,
        @Inject(forwardRef(() => AuthService))
        private authService: AuthService
    ) {}

    async createWallet(userId: string) {
        const wallet = await this.findWalletByUserId(userId);
        if (!wallet) {
            return await this.prisma.wallet.create({
                data: {
                    userId: userId,
                    walletNumber: generateId({ type: "walletNumber" }),
                },
            });
        }
    }

    async createWalletExt(userId: string) {
        const wallet = await this.findWalletByUserId(userId);
        if (wallet) {
            throw new WalletAlreadyCreatedException(
                "Wallet already created",
                HttpStatus.CONFLICT
            );
        }

        const createdwallet = await this.prisma.wallet.create({
            data: {
                userId: userId,
                walletNumber: generateId({ type: "walletNumber" }),
            },
        });

        return buildResponse({
            message: "wallet created",
            data: createdwallet,
        });
    }

    async myWallet(user: User) {
        const wallet = await this.prisma.wallet.findUnique({
            where: { userId: user.id },
        });
        if (!wallet) {
            throw new WalletNotFoundException(
                "No wallet found",
                HttpStatus.NOT_FOUND
            );
        }
        return buildResponse({
            message: "wallet detail successfully retrieved",
            data: wallet,
        });
    }

    async fundWallet(user: User, dto: FundWalletDto) {
        const wallet = await this.findWalletByUserId(user.id);
        if (!wallet) {
            throw new WalletNotFoundException(
                "Wallet not found",
                HttpStatus.NOT_FOUND
            );
        }

        //user can interface with paystack API or any other suitable Wallet service API for payment before wallet is funded

        // Begin transaction

        const result = await this.prisma.$transaction(async (tx) => {
            // Update wallet balance
            const update = await tx.wallet.update({
                where: {
                    userId: user.id,
                },
                data: {
                    availableBalance: { increment: +dto.amount },
                    bookBalance: { increment: +dto.amount },
                },
            });

            return update;
        });
        return buildResponse({
            message: "wallet funded successfully",
            data: result,
        });
    }

    async walletToWalletTransfer(user: User, data: WalletToWalletTransferDto) {
        const senderWallet = await this.findWalletByUserId(user.id);
        if (!senderWallet) {
            throw new WalletNotFoundException(
                "Sender Wallet not found",
                HttpStatus.NOT_FOUND
            );
        }

        if (senderWallet.availableBalance < data.amount) {
            throw new InsufficientWalletBalanceException(
                "Insufficient wallet balance",
                HttpStatus.EXPECTATION_FAILED
            );
        }

        if (senderWallet.walletNumber === data.walletNumber) {
            throw new WalletGenericException(
                "You cannot fund yourself",
                HttpStatus.EXPECTATION_FAILED
            );
        }

        const receiverWallet = await this.prisma.wallet.findUnique({
            where: { walletNumber: data.walletNumber },
        });

        if (!receiverWallet) {
            throw new WalletNotFoundException(
                "receiver Wallet not found",
                HttpStatus.NOT_FOUND
            );
        }

        await this.prisma.$transaction(
            async (tx) => {
                // Update receiver wallet balance
                await tx.wallet.update({
                    where: {
                        id: receiverWallet.id,
                    },
                    data: {
                        availableBalance: { increment: +data.amount },
                        bookBalance: { increment: +data.amount },
                    },
                });

                // Update sender wallet balance
                await tx.wallet.update({
                    where: {
                        id: senderWallet.id,
                    },
                    data: {
                        availableBalance: { decrement: +data.amount },
                        bookBalance: { decrement: +data.amount },
                    },
                });
            },
            {
                maxWait: 5000,
                timeout: 120000,
            }
        );

        return buildResponse({
            message: "Transfer successfull",
        });
    }

    async withdrawFunds(user: User, dto: FundWalletDto) {
        const wallet = await this.findWalletByUserId(user.id);
        if (!wallet) {
            throw new WalletNotFoundException(
                "Wallet not found",
                HttpStatus.NOT_FOUND
            );
        }
        if (wallet.availableBalance < dto.amount) {
            throw new InsufficientWalletBalanceException(
                "Insufficient wallet balance",
                HttpStatus.EXPECTATION_FAILED
            );
        }

        //This amount usually will be tranferred to a given brank account via a suitable API service

        await this.prisma.$transaction(async (tx) => {
            await tx.wallet.update({
                where: { id: wallet.id },
                data: {
                    availableBalance: { decrement: dto.amount },
                    bookBalance: { decrement: dto.amount },
                },
            });
        });
        return buildResponse({
            message: "Withdrawer successfull",
        });
    }

    async findWalletByUserId(userId: string) {
        const wallet = await this.prisma.wallet.findUnique({
            where: { userId: userId },
        });
        return wallet;
    }
}
