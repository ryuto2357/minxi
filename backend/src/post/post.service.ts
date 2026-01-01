import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { AuthUser } from 'src/auth/decorators/current-user.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Post } from 'prisma/generated/client';

@Injectable()
export class PostService {
    constructor(private prisma: PrismaService) {}

    async createPost(user: AuthUser, dto: CreatePostDto) {
        return this.prisma.post.create({
            data: {
                title: dto.title,
                description: dto.description,
                isPrivate: dto.isPrivate ?? false,

                parentId: dto.parentId ?? null,

                creatorId: user.id,
                areaId: user.areaId,

                media: dto.media ? {
                    create: dto.media
                } : undefined,
            }
        });
    }

    async getFeed(user: AuthUser, page: number, limit: number) {
        return this.prisma.post.findMany({
            where: {
                areaId: user.areaId,
                status: "PUBLISHED",
                parentId: null,
                isPrivate: false,
            },
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { createdAt: "desc" },
            include: {
                creator: true,
                _count: {
                    select: { comments: true, pins: true, likes: true }
                }
            }
        });
    }

    async getPostById(user: AuthUser, postId: number) {
        const post = await this.prisma.post.findUnique({
            where: { id: postId },
            include: {
                creator: true,
                media: true,
                _count: {
                    select: { comments: true, pins: true, likes: true }
                }
            }
        });

        if (!post) {
            throw new NotFoundException("Post not found");
        }

        if (post.isPrivate && post.creatorId !== user.id) {
            throw new ForbiddenException("You do not have access to this post");
        }

        return post;
    }

    async getAncestors(postId: number) {
        const ancestors: Post[] = [];

        let current = await this.prisma.post.findUnique({
            where: { id: postId },
            select: { parentId: true, areaId: true }
        });

        if (!current) {
            throw new NotFoundException("Post not found");
        }

        while (current && current.parentId) {
            const parent = await this.prisma.post.findUnique({
                where: { id: current.parentId, areaId: current.areaId },
            });
            
            if (!parent) break;
            
            ancestors.unshift(parent);
            current = parent;
        }

        return ancestors;
    }

    async getReplies(postId: number) {
        return this.prisma.post.findMany({
            where: { parentId: postId, status: "PUBLISHED", isPrivate: false },
            orderBy: { createdAt: "asc" },
            include: {
                creator: true,
                _count: {
                    select: { comments: true, pins: true, likes: true }
                }
            }
        });
    }

    async likePost(user: AuthUser, postId: number) {
        const post = await this.prisma.post.findUnique({
            where: { id: postId, areaId: user.areaId }
        });

        if (!post) {
            throw new NotFoundException("Post not found");
        }

        if (post.isPrivate) {
            throw new ForbiddenException("Cannot like a private post");
        }

        if (post.status !== "PUBLISHED") {
            throw new ForbiddenException("Cannot like an unpublished post");
        }

        try {
            return await this.prisma.postLike.create({
                data: {
                    userId: user.id,
                    postId: postId,
                }
            });
        } catch (error) {
            throw new BadRequestException("You have already liked this post");
        }
    }

    async unlikePost(user: AuthUser, postId: number) {
        try {
            return await this.prisma.postLike.delete({
                where: {
                    userId_postId: {
                        userId: user.id,
                        postId: postId,
                    },
                }
            });
        } catch (error) {
            throw new NotFoundException("You have not liked this post");
        }        
    }

    async commentPost(user: AuthUser, postId: number, content: string) {
        const post = await this.prisma.post.findUnique({
            where: { id: postId, areaId: user.areaId }
        });

        if (!post) {
            throw new NotFoundException("Post not found");
        }

        if (post.isPrivate) {
            throw new ForbiddenException("Cannot comment on a private post");
        }

        if (post.status !== "PUBLISHED") {
            throw new ForbiddenException("Cannot comment on an unpublished post");
        }

        return this.prisma.postComment.create({
            data: {
                message: content,
                postId: postId,
                userId: user.id,
            }
        });
    }

    async increaseViewCount(postId: number) {
        return this.prisma.post.update({
            where: { id: postId },
            data: {
                viewCount: {
                    increment: 1
                }
            }
        });
    }

    async pinPost(user: AuthUser, postId: number) {
        return this.prisma.postPin.create({
            data: {
                userId: user.id,
                postId: postId,
            }
        });
    }

    async unpinPost(user: AuthUser, postId: number) {
        try {
            return await this.prisma.postPin.delete({
                where: {
                    userId_postId: {
                        userId: user.id,
                        postId: postId,
                    },
                }
            });
        } catch (error) {
            throw new NotFoundException("You have not pinned this post");
        }
    }
}
