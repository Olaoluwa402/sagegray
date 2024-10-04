import { forwardRef, Global, Module } from "@nestjs/common";
import { AuthModule } from "../auth";
import { WalletController } from "./controllers/v1";
import { WalletService } from "./services";
export * from "./interfaces";
export * from "./errors";

@Global()
@Module({
    imports: [forwardRef(() => AuthModule)],
    controllers: [WalletController],
    providers: [WalletService],
    exports: [WalletService],
})
export class WalletModule {}
