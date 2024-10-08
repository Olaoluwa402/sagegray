import { forwardRef, Module } from "@nestjs/common";
import { AuthService } from "./services";
import { JwtModule } from "@nestjs/jwt";
import { jwtSecret, TOKEN_EXPIRATION } from "@/config";
import { AuthController } from "./controllers/v1";
import { WalletModule } from "../wallet";
import { AuthGuard } from "./guard";
export * from "./interfaces";
export * from "./errors";

@Module({
    imports: [
        forwardRef(() => WalletModule),
        JwtModule.register({
            global: true,
            secret: jwtSecret,
            signOptions: { expiresIn: TOKEN_EXPIRATION },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, AuthGuard],
    exports: [AuthService],
})
export class AuthModule {}
