import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEnum, IsOptional, IsString } from "class-validator";
import { ContentType, PublishStatus } from "prisma/generated/enums";

export class CreateContentDto {
    @IsString()
    @ApiProperty({ example: "I love nahida!" })
    title!: string;

    @IsString()
    @ApiProperty({ example: "This content is all about Nahida character in Genshin Impact game." })
    description!: string;

    @IsEnum(ContentType)
    @ApiProperty({ example: "post", enum: ContentType })
    type!: ContentType;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({ example: false, required: false })
    isPrivate?: boolean;

    @IsEnum(PublishStatus)
    @IsOptional()
    @ApiProperty({ example: "DRAFT", enum: PublishStatus, required: false })
    status?: PublishStatus;

    @IsString()
    @IsOptional()
    @ApiProperty({ example: "http://example.com/thumbnail.jpg", required: false })
    thumbnail?: string;

    @IsOptional()
    @ApiProperty({ example: "2024-12-31T23:59:59.000Z", required: false })
    publishedAt?: Date;
}