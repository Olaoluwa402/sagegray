import { HttpException } from "@nestjs/common";

export class WalletNotFoundException extends HttpException {
    name = "WalletNotFoundException";
}

export class InsufficientWalletBalanceException extends HttpException {
    name = "InsufficientWalletBalanceException";
}

export class WalletGenericException extends HttpException {
    name = "WalletGenericException";
}

export class WalletAlreadyCreatedException extends HttpException {
    name = "WalletAlreadyCreatedException";
}
