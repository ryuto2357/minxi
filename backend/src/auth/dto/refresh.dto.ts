import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class RefreshDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY4ODc4MjM4MywiZXhwIjoxNjg4Nzg2OTgzfQ.XYZ123abc456DEF789ghi0jklmNOPQrstUVWxyZ" })
    refreshToken!: string;
}