import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { BoardService } from './board.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthUser, CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { CreateBoardDto } from './dto/create-board.dto';
import { AddBoardItemDto } from './dto/add-board-item.dto';

@UseGuards(AuthGuard("jwt"))
@Controller('board')
export class BoardController {
    constructor(private readonly boardService: BoardService) {}

    @Post()
    createBoard(@CurrentUser() user: AuthUser, @Body() dto: CreateBoardDto) {
        return this.boardService.createBoard(user, dto);
    }

    @Get("me")
    getMyBoards(@CurrentUser() user: AuthUser) {
        return this.boardService.getMyBoards(user);
    }

    @Post(":id/items")
    addItemToBoard(@CurrentUser() user: AuthUser, @Param("id") id: string, @Body() dto: AddBoardItemDto) {
        return this.boardService.addItemToBoard(user, +id, dto);
    }

    @Delete(":id/items")
    removeItemFromBoard(@CurrentUser() user: AuthUser, @Param("id") id: string, @Body() dto: AddBoardItemDto) {
        return this.boardService.removeItemFromBoard(user, +id, dto);
    }
}
