import { PrismaService } from "@/modules/core/prisma/services";
import { generateRandomNum } from "@/utils";
import { ApiResponse, buildResponse } from "@/utils/api-response-util";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { Prisma, User } from "@prisma/client";
import { AuthService } from "../../auth/services";
import { UpdateProfileDto } from "../dtos";

import { UploadFactory } from "@/modules/core/upload/services";
import { CloudinaryService } from "@/modules/core/upload/services/cloudinary";
import { UploadApiResponse } from "cloudinary";

@Injectable()
export class UserService {
    private uploadService: CloudinaryService;
    constructor(
        private prisma: PrismaService,
        @Inject(forwardRef(() => AuthService))
        private authService: AuthService,
        private uploadFactory: UploadFactory
    ) {
        this.uploadService = this.uploadFactory.build({
            provider: "cloudinary",
        });
    }

    async findUserByIdentifier(identifier: string) {
        return await this.prisma.user.findUnique({
            where: { identifier: identifier },
        });
    }

    async findUserByEmail(email: string) {
        return await this.prisma.user.findUnique({ where: { email } });
    }
    async findUserById(id: string) {
        return await this.prisma.user.findUnique({
            where: { id: id },
        });
    }

    async getProfile(identifier: string): Promise<ApiResponse> {
        const user = await this.prisma.user.findUnique({
            where: { identifier: identifier },
            select: {
                firstName: true,
                lastName: true,
                email: true,
                identifier: true,
                phone: true,
                photo: true,
                status: true,
                walletSetupStatus: true,
            },
        });
        return buildResponse({
            message: "Profile successfully retrieved",
            data: user,
        });
    }

    async updateProfile(options: UpdateProfileDto, user: User) {
        const profileUpdateOptions: Prisma.UserUncheckedUpdateInput = {
            firstName: options.firstName ?? user.firstName,
            lastName: options.lastName ?? user.lastName,
            phone: options.phone ?? user.phone,
        };

        if (options.photo) {
            const uploadRes = await this.uploadProfileImage(options.photo);
            profileUpdateOptions.photo = uploadRes.secure_url;
        }

        const updatedProfile = await this.prisma.user.update({
            where: {
                id: user.id,
            },
            data: profileUpdateOptions,
            select: {
                firstName: true,
                lastName: true,
                phone: true,
                photo: true,
            },
        });

        return buildResponse({
            message: "profile successfully updated",
            data: updatedProfile,
        });
    }

    private async uploadProfileImage(file: string): Promise<UploadApiResponse> {
        const date = Date.now();
        const body = Buffer.from(file, "base64");

        return await this.uploadService.uploadCompressedImage({
            dir: "profile",
            name: `profile-image-${date}-${generateRandomNum(5)}`,
            format: "webp",
            body: body,
            quality: 100,
            width: 320,
            type: "image",
        });
    }
}
