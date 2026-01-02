import { IsBoolean, IsOptional, IsString } from "class-validator";

export class CreateBoardDto {
    @IsString()
    name!: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsBoolean()
    isPrivate!: boolean;
}