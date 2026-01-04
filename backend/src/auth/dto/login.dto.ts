import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsString, MaxLength, MinLength } from "class-validator";

export class LoginDto {
    @IsString()
    @MinLength(3)
    @MaxLength(20)
    @ApiProperty({ example: "nahida" })
    username!: string;

    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @ApiProperty({ example: "nahida123" })
    password!: string;

    @IsEnum(['China', 'America', 'Indonesia'])
    @ApiProperty({ example: "China", enum: ['China', 'America', 'Indonesia'] })
    area!: "China" | "America" | "Indonesia";
}