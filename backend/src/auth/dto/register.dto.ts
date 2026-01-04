import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsString, MaxLength, MinLength } from "class-validator";

export class RegisterDto {
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
  
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @ApiProperty({ example: "nahida123" })
  confirmPassword!: string;

  @ApiProperty({ example: "China", enum: ['China', 'America', 'Indonesia'] })
  @IsEnum(['China', 'America', 'Indonesia'])
  area!: "China" | "America" | "Indonesia";
}