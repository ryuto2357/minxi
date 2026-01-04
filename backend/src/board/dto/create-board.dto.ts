import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString } from "class-validator";

export class CreateBoardDto {
    @IsString()
    @ApiProperty({ example: "Nahida board!" })
    name!: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ example: "This is a board for Nahida fans!", required: false })
    description?: string;

    @IsBoolean()
    @ApiProperty({ example: false })
    isPrivate!: boolean;
}