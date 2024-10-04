import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

class BaseDto {
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    amount: number;
}

export class FundWalletDto extends BaseDto {}

export class WalletToWalletTransferDto extends BaseDto {
    @IsNotEmpty()
    @IsString()
    walletNumber: string;
}

export class WithdrawFundDto extends BaseDto {}
