import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthUser, CurrentUser } from './decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    
    @Post("register")
    async register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }
    
    @Post("login")
    async login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }
    
    @Post("refresh")
    async refresh(@Body() dto: RefreshDto) {
        return this.authService.refreshToken(dto.refreshToken);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post("logout")
    async logout(@CurrentUser() user: AuthUser) {
        return this.authService.logout(user.id);
    }
}
