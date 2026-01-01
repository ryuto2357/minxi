import { IsBoolean, IsInt, IsOptional, IsString } from "class-validator";

export class CreatePostDto {
    @IsString()
    title!: string;

    @IsString()
    description!: string;

    @IsBoolean()
    @IsOptional()
    isPrivate?: boolean;

    @IsOptional()
    parentId?: number;

    @IsOptional()
    media?: {
        mediaUrl: string;
        mediaType: "image" | "video";
    }[];
}