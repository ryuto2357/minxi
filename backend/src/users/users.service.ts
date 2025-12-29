import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuthUser } from 'src/auth/decorators/current-user.decorator';

@Injectable()
export class UsersService {
    constructor(private prismaService: PrismaService) {}

    async getMe(userId: number) {
        const user = await this.prismaService.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                bio: true,
                profilePicture: true,
                area: {
                    select: {
                        name: true
                    }
                }
            }
        })

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return {
            id: user.id,
            username: user.username,
            bio: user.bio,
            profilePicture: user.profilePicture,
            areaName: user.area.name
        };
    }


    async updateProfile(userId: number, updateProfileDto: UpdateProfileDto) {
        const user = await this.prismaService.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const updatedUser = await this.prismaService.user.update({
            where: { id: userId },
            data: {
                bio: updateProfileDto.bio,
                profilePicture: updateProfileDto.profilePicture
            },
            select: {
                id: true,
                username: true,
                bio: true,
                profilePicture: true,
                area: {
                    select: {
                        name: true
                    }
                }
            }
        })

        return {
            id: updatedUser.id,
            username: updatedUser.username,
            bio: updatedUser.bio,
            profilePicture: updatedUser.profilePicture,
            area: updatedUser.area.name,
        };
    }

    async followUser(user: AuthUser, targetUserId: number) {
        if (user.id === targetUserId) {
            throw new NotFoundException("You cannot follow yourself");
        }

        const targetUser = await this.prismaService.user.findUnique({
            where: { id: targetUserId },
            select: { id: true, areaId: true }
        });

        if (!targetUser) {
            throw new NotFoundException("Target user not found");
        }

        if (targetUser.areaId != user.areaId) {
            throw new ForbiddenException("You can only follow users in the same area");
        }

        const alreadyFollowing = await this.prismaService.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: user.id,
                    followingId: targetUserId
                }
            }
        })

        if (alreadyFollowing) {
            throw new BadRequestException("You are already following this user");
        }

        await this.prismaService.follow.create({
            data: {
                followerId: user.id,
                followingId: targetUserId
            }
        });

        return { message: "Successfully followed the user" };
    }
}
