import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, IsUrl, MaxLength } from "class-validator";

export class UpdateProfileDto {
    @IsOptional()
    @IsString()
    @MaxLength(50)
    @ApiProperty({ example: "Nahida Nahida", required: false })
    bio?: string;

    @IsOptional()
    @IsUrl()
    @ApiProperty({ example: "http://example.com/profile.jpg", required: false })
    profilePicture?: string;
}