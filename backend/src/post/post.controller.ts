import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { AuthUser, CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard("jwt"))
@Controller('posts')
export class PostController {
    constructor(private readonly postService: PostService) {}

    @Post()
    createPost(@CurrentUser() user: AuthUser, @Body() dto: CreatePostDto) {
        return this.postService.createPost(user, dto);
    }

    @Get("feed")
    getFeed(@CurrentUser() user: AuthUser, @Query("page") page: string = "1", @Query("limit") limit: string = "10") {
        return this.postService.getFeed(user, +page, +limit);
    }

    @Get(":id")
    getPostById(@CurrentUser() user: AuthUser, @Param("id") postId: string) {
        return this.postService.getPostById(user, +postId);
    }

    @Get(":id/ancestors")
    getPostAncestors(@Param("id") postId: string) {
        return this.postService.getAncestors(+postId);
    }

    @Get(":id/replies")
    getPostReplies(@Param("id") postId: string) {
        return this.postService.getReplies(+postId);
    }

    @Post(":id/like")
    likePost(@CurrentUser() user: AuthUser, @Param("id") postId: string) {
        return this.postService.likePost(user, +postId);
    }

    @Delete(":id/like")
    unlikePost(@CurrentUser() user: AuthUser, @Param("id") postId: string) {
        return this.postService.unlikePost(user, +postId);
    }

    @Post(":id/comment")
    commentPost(@CurrentUser() user: AuthUser, @Param("id") postId: string, @Body() dto: CreateCommentDto) {
        return this.postService.commentPost(user, +postId, dto.message);
    }

    @Patch(":id/view")
    viewPost(@Param("id") postId: string) {
        return this.postService.increaseViewCount(+postId);
    }

    @Post(":id/pin")
    pinPost(@CurrentUser() user: AuthUser, @Param("id") postId: string) {
        return this.postService.pinPost(user, +postId);
    }

    @Delete(":id/pin")
    unpinPost(@CurrentUser() user: AuthUser, @Param("id") postId: string) {
        return this.postService.unpinPost(user, +postId);
    }
}
