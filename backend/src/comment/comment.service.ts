import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { AuthUser } from 'src/auth/decorators/current-user.decorator';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CommentService {
    constructor(private prismaService: PrismaService) {}

    async deleteComment(user: AuthUser, commentId: number) {
        const comment = await this.prismaService.contentComment.findUnique({
            where: { id: commentId }
        });

        if (!comment) {
            throw new NotFoundException("Comment not found");
        }

        if (comment.userId !== user.id) {
            throw new ForbiddenException("You do not have permission to delete this comment");
        }

        return this.prismaService.contentComment.delete({
            where: { id: commentId }
        });
    }
}
