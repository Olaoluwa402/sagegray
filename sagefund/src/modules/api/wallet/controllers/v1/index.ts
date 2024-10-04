import { AuthGuard } from "@/modules/api/auth/guard";
import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    UseGuards,
    ValidationPipe,
} from "@nestjs/common";
import { User as UserModel } from "@prisma/client";
import { WalletService } from "../../services";
import { User } from "@/modules/api/user";
import {
    FundWalletDto,
    WalletToWalletTransferDto,
    WithdrawFundDto,
} from "../../dtos";

@Controller({
    path: "wallet",
})
export class WalletController {
    constructor(private readonly walletService: WalletService) {}

    @Get()
    @UseGuards(AuthGuard)
    async myWallet(@User() user: UserModel): Promise<ApiResponse> {
        return await this.walletService.myWallet(user);
    }

    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    @Post("fund")
    async fundWallet(
        @Body(ValidationPipe) fundWalletDto: FundWalletDto,
        @User() user: UserModel
    ) {
        return await this.walletService.fundWallet(user, fundWalletDto);
    }

    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    @Post("transfer-fund")
    async walletToWalletTransfer(
        @Body(ValidationPipe) dto: WalletToWalletTransferDto,
        @User() user: UserModel
    ) {
        return await this.walletService.walletToWalletTransfer(user, dto);
    }

    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    @Post("withdraw-fund")
    async withdrawFunds(
        @Body(ValidationPipe) dto: WithdrawFundDto,
        @User() user: UserModel
    ) {
        return await this.walletService.withdrawFunds(user, dto);
    }
}
