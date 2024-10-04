import { RequestWithUser } from "@/modules/api/auth";
import { AuthGuard } from "@/modules/api/auth/guard";
import {
    Body,
    Controller,
    Get,
    Patch,
    Req,
    UseGuards,
    ValidationPipe,
} from "@nestjs/common";
import { User as UserModel } from "@prisma/client";
import { User } from "../../decorators";
import { UpdateProfileDto } from "../../dtos";
import { UserService } from "../../services";

@Controller({
    path: "user",
})
export class UserController {
    constructor(private readonly userService: UserService) {}

    @UseGuards(AuthGuard)
    @Get("profile")
    async getProfile(@Req() req: RequestWithUser) {
        return await this.userService.getProfile(req.user.identifier);
    }

    @UseGuards(AuthGuard)
    @Patch("profile")
    async updateProfile(
        @Body(ValidationPipe) updateProfileDto: UpdateProfileDto,
        @User() user: UserModel
    ) {
        return await this.userService.updateProfile(updateProfileDto, user);
    }
}
