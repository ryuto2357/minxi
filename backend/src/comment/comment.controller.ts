import { Controller, Delete, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CommentService } from './comment.service';
import { AuthUser, CurrentUser } from 'src/auth/decorators/current-user.decorator';

@UseGuards(AuthGuard("jwt"))
@Controller('comments')
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @Delete(":id")
    deleteComment(@CurrentUser() user: AuthUser, @Param("id") commentId: string) {
        return this.commentService.deleteComment(user, +commentId);
    }
}
