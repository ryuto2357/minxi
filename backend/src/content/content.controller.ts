import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ContentService } from './content.service';
import { AuthUser, CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';

@UseGuards(AuthGuard("jwt"))
@Controller('contents')
export class ContentController {
    constructor(private readonly contentService: ContentService) {}

    @Post()
    createContent(@CurrentUser() user: AuthUser, @Body() createContentDto: CreateContentDto) {
        return this.contentService.createContent(user, createContentDto);
    }

    @Patch(":id")
    updateContent(@CurrentUser() user: AuthUser, @Param("id") contentId: number, @Body() updateContentDto: UpdateContentDto) {
        return this.contentService.updateContent(user, +contentId, updateContentDto);
    }

    @Get("feed")
    getFeed(@CurrentUser() user: AuthUser, @Query("page") page: number, @Query("limit") limit: number) {
        return this.contentService.getFeed(user, +page, +limit);
    }

    @Get("me")
    getMyContent(@CurrentUser() user: AuthUser) {
        return this.contentService.getMyContent(user);
    }

    @Delete(":id")
    deleteContent(@CurrentUser() user: AuthUser, @Param("id") contentId: number) {
        return this.contentService.deleteContent(user, +contentId);
    }
}
