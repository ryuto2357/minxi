import { IsOptional, IsString, IsUrl, MaxLength } from "class-validator";

export class UpdateProfileDto {
    @IsOptional()
    @IsString()
    @MaxLength(50)
    bio?: string;

    @IsOptional()
    @IsUrl()
    profilePicture?: string;
}