import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class AddBoardItemDto {
    @IsNumber()
    @ApiProperty({ example: 1 })
    targetId!: number;

    @IsString()
    @ApiProperty({ example: "post", enum: ["post", "content"] })
    targetType!: "post" | "content";
}