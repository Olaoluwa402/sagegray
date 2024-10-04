import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma";
import { UploadModule } from "./upload";

@Module({
    imports: [PrismaModule, UploadModule],
})
export class CoreModule {}
