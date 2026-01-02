import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AuthUser } from 'src/auth/decorators/current-user.decorator';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { NotFoundError } from 'rxjs';
import { AddBoardItemDto } from './dto/add-board-item.dto';

@Injectable()
export class BoardService {
    constructor(private prisma: PrismaService) {}

    async createBoard(user: AuthUser, dto: CreateBoardDto) {
        return this.prisma.board.create({
            data: {
                name: dto.name,
                description: dto.description,
                isPrivate: dto.isPrivate ?? false,
                userId: user.id,
                areaId: user.areaId,
            }
        });
    }

    async getMyBoards(user: AuthUser) {
        return this.prisma.board.findMany({
            where: {
                userId: user.id,
                areaId: user.areaId,
            },
            include: {
                items: true,
            }
        });
    }

    async getBoardsById(user: AuthUser, boardId: number) {
        return this.prisma.board.findMany({
            where: {
                id: boardId,
                userId: user.id,
                areaId: user.areaId,
            },
            include: {
                items: true,
            }
        });
    }

    async addItemToBoard(user: AuthUser, boardId: number, dto: AddBoardItemDto) {
        const board = await this.prisma.board.findFirst({
            where: {
            id: boardId,
            userId: user.id,
            areaId: user.areaId,
            },
        });

        if (!board) {
            throw new NotFoundException("Board not found");
        }

        if (dto.targetType === "post") {
            const post = await this.prisma.post.findFirst({
            where: {
                id: dto.targetId,
                areaId: user.areaId,
                status: "PUBLISHED",
                isPrivate: false,
            },
            });
            if (!post) throw new NotFoundException("Post not found");
        }

        if (dto.targetType === "content") {
            const content = await this.prisma.content.findFirst({
            where: {
                id: dto.targetId,
                areaId: user.areaId,
                status: "PUBLISHED",
                isPrivate: false,
            },
            });
            if (!content) throw new NotFoundException("Content not found");
        }

        try {
            return await this.prisma.boardItem.create({
            data: {
                boardId: boardId,
                targetId: dto.targetId,
                targetType: dto.targetType,
            },
            });
        } catch {
            throw new BadRequestException("Item already in board");
        }
    }

    async removeItemFromBoard(user: AuthUser, boardId: number, dto: AddBoardItemDto) {
        const board = await this.prisma.board.findFirst({
            where: {
                id: boardId,
                userId: user.id,
                areaId: user.areaId,
            },
        });

        if (!board) {
            throw new NotFoundException("Board not found");
        }

        return this.prisma.boardItem.delete({
            where: {
                boardId_targetType_targetId: {
                    boardId: boardId,
                    targetType: dto.targetType,
                    targetId: dto.targetId,
                }
            },
        });
    }
}
