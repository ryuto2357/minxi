import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { AuthUser } from 'src/auth/decorators/current-user.decorator';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class ContentService {
    constructor(private prismaService: PrismaService) {}

    async createContent(user: AuthUser, createContentDto: CreateContentDto) {
        return this.prismaService.content.create({
            data: {
                ...createContentDto,
                creatorId: user.id,
                areaId: user.areaId
            }
        });
    }

    async updateContent(user: AuthUser, contentId: number, updateContentDto: UpdateContentDto) {
        const content = await this.prismaService.content.findUnique({
            where: { id: contentId }
        });

        if (!content) {
            throw new NotFoundException("Content not found");
        }

        if (content.creatorId !== user.id) {
            throw new ForbiddenException("You do not have permission to update this content");
        }

        return this.prismaService.content.update({
            where: { id: contentId },
            data: updateContentDto
        });
    }

    async getFeed(user: AuthUser, page: number, limit: number) {
        const contents = await this.prismaService.content.findMany({
            where: {
                areaId: user.areaId,
                status: "PUBLISHED",
                isPrivate: false
            },
            orderBy: {
                popularity: "desc"
            },
            skip: (page - 1) * limit,
            take: limit,
            include: {
                creator: {
                    select: {
                        id: true,
                        username: true,
                        profilePicture: true
                    }
                },
                media: true,
                _count: {
                    select: {
                        likes: true, comments: true, pins: true, reports: true
                    }
                },
                likes: {
                    where: { userId: user.id },
                    select: { userId: true }
                },
                pins: {
                    where: { userId: user.id },
                    select: { userId: true }
                }
            },
        });

        return contents.map(content => ({
            ...content,
            likedByMe: content.likes.length > 0,
            pinnedByMe: content.pins.length > 0,
            likes: undefined,
            pins: undefined
        }));
    }

    async getMyContents(user: AuthUser) {
        const contents = await this.prismaService.content.findMany({
            where: {
                creatorId: user.id
            },
            orderBy: {
                createdAt: "desc"
            },
            include: {
                media: true,
                _count: {
                    select: {
                        likes: true, comments: true, pins: true, reports: true
                    }
                },
                likes: {
                    where: { userId: user.id },
                    select: { userId: true }
                },
                pins: {
                    where: { userId: user.id },
                    select: { userId: true }
                }
            }
        });

        return contents.map(content => ({
            ...content,
            likedByMe: content.likes.length > 0,
            pinnedByMe: content.pins.length > 0,
            likes: undefined,
            pins: undefined
        }));
    }

    async getContent(user: AuthUser, contentId: number) {
        const content = await this.prismaService.content.findUnique({
            where: { id: contentId },
            include: {
                creator: {
                    select: {
                        id: true,
                        username: true,
                        profilePicture: true
                    }
                },
                media: true,
                _count: {
                    select: {
                        likes: true, comments: true, pins: true, reports: true
                    }
                },
                likes: {
                    where: { userId: user.id },
                    select: { userId: true }
                },
                pins: {
                    where: { userId: user.id },
                    select: { userId: true }
                }
            }
        });

        if (!content) {
            throw new NotFoundException("Content not found");
        }

        if (content.isPrivate && content.creatorId !== user.id) {
            throw new ForbiddenException("You do not have permission to view this content");
        }

        if (content.status !== "PUBLISHED" && content.creatorId !== user.id) {
            throw new ForbiddenException("You do not have permission to view this content");
        }
        
        return {
            ...content,
            likedByMe: content.likes.length > 0,
            pinnedByMe: content.pins.length > 0,
            likes: undefined,
            pins: undefined
        };
    }

    async deleteContent(user: AuthUser, contentId: number) {
        const content = await this.prismaService.content.findUnique({
            where: { id: contentId }
        });

        if (!content) {
            throw new NotFoundException("Content not found");
        }

        if (content.creatorId !== user.id) {
            throw new ForbiddenException("You do not have permission to delete this content");
        }

        return this.prismaService.content.delete({
            where: { id: contentId }
        });
    }

    async likeContent(user: AuthUser, contentId: number) {
        const content = await this.prismaService.content.findUnique({
            where: { id: contentId }
        });

        if (!content) {
            throw new NotFoundException("Content not found");
        }

        if (content.isPrivate) {
            throw new ForbiddenException("You cannot like private content");
        }

        if (content.status !== "PUBLISHED") {
            throw new ForbiddenException("You cannot like unpublished content");
        }

        try {
            return await this.prismaService.contentLike.create({
                data: {
                    userId: user.id,
                    contentId: contentId
                }
            });
        } catch (error) {
            throw new BadRequestException("You have already liked this content");
        }
    }

    async unlikeContent(user: AuthUser, contentId: number) {
        try {
            return await this.prismaService.contentLike.delete({
                where: {
                    userId_contentId: {
                        userId: user.id,
                        contentId: contentId
                    }
                }
            });
        } catch (error) {
            throw new NotFoundException("You have not liked this content");
        }
    }

    async addComment(user: AuthUser, contentId: number, createCommentDto: CreateCommentDto) {
        const content = await this.prismaService.content.findUnique({
            where: { id: contentId }
        });

        if (!content) {
            throw new NotFoundException("Content not found");
        }

        if (content.isPrivate) {
            throw new ForbiddenException("You cannot comment on private content");
        }

        if (content.status !== "PUBLISHED") {
            throw new ForbiddenException("You cannot comment on unpublished content");
        }


        return this.prismaService.contentComment.create({
            data: {
                message: createCommentDto.message,
                contentId: contentId,
                userId: user.id
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        profilePicture: true
                    }
                }
            }
        });
    }

    async getComments(user: AuthUser, contentId: number) {
        const comments = await this.prismaService.contentComment.findMany({
            where: { contentId: contentId },
            orderBy: { createdAt: "asc" },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        profilePicture: true
                    }
                }
            }
        });

        return comments.map(comment => ({
            id: comment.id,
            message: comment.message,
            createdAt: comment.createdAt,
            user: comment.user,
            isMine: comment.userId === user.id,
            replies: []
        }));
    }

    async pinContent(user: AuthUser, contentId: number) {
        const content = await this.prismaService.content.findUnique({
            where: { id: contentId }
        });

        if (!content) {
            throw new NotFoundException("Content not found");
        }

        if (content.isPrivate) {
            throw new ForbiddenException("You cannot pin private content");
        }

        if (content.status !== "PUBLISHED") {
            throw new ForbiddenException("You cannot pin unpublished content");
        }

        if (content.creatorId !== user.id) {
            throw new ForbiddenException("You do not have permission to pin this content");
        }

        try {
            return await this.prismaService.contentPin.create({
                data: {
                    userId: user.id,
                    contentId: contentId
                }
            });
        } catch (error) {
            throw new BadRequestException("You have already pinned this content");
        }
    }

    async unpinContent(user: AuthUser, contentId: number) {
        try {
            return await this.prismaService.contentPin.delete({
                where: {
                    userId_contentId: {
                        userId: user.id,
                        contentId: contentId
                    }
                }
            });
        } catch (error) {
            throw new NotFoundException("You have not pinned this content");
        }
    }
}
