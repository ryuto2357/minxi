import { IsNumber, IsString } from "class-validator";

export class AddBoardItemDto {
    @IsNumber()
    targetId!: number;

    @IsString()
    targetType!: "post" | "content";
}