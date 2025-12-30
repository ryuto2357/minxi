import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { AuthUser } from 'src/auth/decorators/current-user.decorator';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';

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
            throw new NotFoundException('Content not found');
        }

        if (content.creatorId !== user.id) {
            throw new ForbiddenException('You do not have permission to update this content');
        }

        return this.prismaService.content.update({
            where: { id: contentId },
            data: updateContentDto
        });
    }

    async getFeed(user: AuthUser, page: number, limit: number) {
        return this.prismaService.content.findMany({
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
                media: true
            }
        });
    }

    async getMyContent(user: AuthUser) {
        return this.prismaService.content.findMany({
            where: {
                creatorId: user.id
            },
            orderBy: {
                createdAt: "desc"
            },
        });
    }

    async deleteContent(user: AuthUser, contentId: number) {
        const content = await this.prismaService.content.findUnique({
            where: { id: contentId }
        });

        if (!content) {
            throw new NotFoundException('Content not found');
        }

        if (content.creatorId !== user.id) {
            throw new ForbiddenException('You do not have permission to delete this content');
        }

        return this.prismaService.content.delete({
            where: { id: contentId }
        });
    }
}
