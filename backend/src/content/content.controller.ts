import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ContentService } from './content.service';
import { AuthUser, CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@UseGuards(AuthGuard("jwt"))
@Controller('contents')
export class ContentController {
    constructor(private readonly contentService: ContentService) {}

    @Post()
    createContent(@CurrentUser() user: AuthUser, @Body() createContentDto: CreateContentDto) {
        return this.contentService.createContent(user, createContentDto);
    }

    @Patch(":id")
    updateContent(@CurrentUser() user: AuthUser, @Param("id") contentId: string, @Body() updateContentDto: UpdateContentDto) {
        return this.contentService.updateContent(user, +contentId, updateContentDto);
    }

    @Get("feed")
    getFeed(@CurrentUser() user: AuthUser, @Query("page") page: string = "1", @Query("limit") limit: string = "10") {
        type GetDataReturn = ReturnType<typeof this.contentService.getFeed>;
        return this.contentService.getFeed(user, +page, +limit);
    }

    @Get("me")
    getMyContents(@CurrentUser() user: AuthUser) {
        return this.contentService.getMyContents(user);
    }

    @Get(":id")
    getContent(@CurrentUser() user: AuthUser,  @Param("id") contentId: string) {
        return this.contentService.getContent(user, +contentId);
    }

    @Delete(":id")
    deleteContent(@CurrentUser() user: AuthUser, @Param("id") contentId: string) {
        return this.contentService.deleteContent(user, +contentId);
    }


    @Post(":id/like")
    likeContent(@CurrentUser() user: AuthUser, @Param("id") contentId: string) {
        return this.contentService.likeContent(user, +contentId);
    }

    @Delete(":id/like")
    unlikeContent(@CurrentUser() user: AuthUser, @Param("id") contentId: string) {
        return this.contentService.unlikeContent(user, +contentId);
    }


    @Post(":id/comments")
    addComment(@CurrentUser() user: AuthUser, @Param("id") contentId: string, @Body() createCommentDto: CreateCommentDto) {
        return this.contentService.addComment(user, +contentId, createCommentDto);
    }

    @Get(":id/comments")
    getComments(@CurrentUser() user: AuthUser, @Param("id") contentId: string) {
        return this.contentService.getComments(user, +contentId);
    }

    @Post(":id/pin")
    pinContent(@CurrentUser() user: AuthUser, @Param("id") contentId: string) {
        return this.contentService.pinContent(user, +contentId);
    }

    @Delete(":id/pin")
    unpinContent(@CurrentUser() user: AuthUser, @Param("id") contentId: string) {
        return this.contentService.unpinContent(user, +contentId);
    }
}
