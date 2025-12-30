import { IsBoolean, IsEnum, IsOptional, IsString } from "class-validator";
import { ContentType, PublishStatus } from "prisma/generated/enums";

export class CreateContentDto {
    @IsString()
    title!: string;

    @IsString()
    description!: string;

    @IsEnum(ContentType)
    type!: ContentType;

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