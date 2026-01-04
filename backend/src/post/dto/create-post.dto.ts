import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsInt, IsOptional, IsString } from "class-validator";

export class CreatePostDto {
    @IsString()
    @ApiProperty({ example: "I love nahida!" })
    title!: string;

    @IsString()
    @ApiProperty({ example: "This post is all about Nahida character in Genshin Impact game." })
    description!: string;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({ example: false, required: false })
    isPrivate?: boolean;

    @IsOptional()
    @IsInt()
    @ApiProperty({ example: 1, required: false })
    parentId?: number;

    @IsOptional()
    @ApiProperty({ example: "DRAFT", required: false })
    status?: "DRAFT" | "PUBLISHED";

    @IsOptional()
    @ApiProperty({ example: [{ mediaUrl: "http://example.com/image.jpg", mediaType: "image" }], required: false })
    media?: {
        mediaUrl: string;
        mediaType: "image" | "video";
    }[];
}