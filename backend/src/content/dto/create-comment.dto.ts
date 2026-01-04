import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateCommentDto {
    @IsString()
    @ApiProperty({ example: "This is a comment!" })
    message!: string;
}