import { IsEnum, IsString, MaxLength, MinLength } from "class-validator";

export class RegisterDto {
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  username!: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  password!: string;
  
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  confirmPassword!: string;

  @IsEnum(['China', 'America', 'Indonesia'])
  area!: "China" | "America" | "Indonesia";
}