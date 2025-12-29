import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthUser, CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @UseGuards(AuthGuard("jwt"))
    @Get("me")
    getMe(@CurrentUser() user: AuthUser) {
        return this.usersService.getMe(user.id);
    }

    @UseGuards(AuthGuard("jwt"))
    @Patch("me")
    updateProfile(@CurrentUser() user: AuthUser, @Body() updateProfileDto: UpdateProfileDto) {
        return this.usersService.updateProfile(user.id, updateProfileDto);
    }

    @UseGuards(AuthGuard("jwt"))
    @Post(":id/follow")
    followUser(@CurrentUser() user: AuthUser, @Param("id", ParseIntPipe) targetUserId: number) {
        return this.usersService.followUser(user, targetUserId);
    }
}
