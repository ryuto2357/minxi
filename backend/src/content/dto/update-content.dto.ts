import { IsBoolean, IsEnum, IsOptional, IsString } from "class-validator";
import { PublishStatus } from "prisma/generated/enums";

export class UpdateContentDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsBoolean()
    @IsOptional()
    isPrivate?: boolean;

    @IsEnum(PublishStatus)
    @IsOptional()
    status?: PublishStatus;

    @IsString()
    @IsOptional()
    thumbnail?: string;

    @IsOptional()
    publishedAt?: Date;
}