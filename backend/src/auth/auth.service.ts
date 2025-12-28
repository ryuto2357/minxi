import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './types/jwt-payload.interface';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwtService: JwtService) {}

    async register(dto: RegisterDto) {
        const { username, password, confirmPassword, area } = dto;

        if (password !== confirmPassword) {
            throw new BadRequestException("Passwords do not match");
        }

        const areaData = await this.prisma.area.findUnique({
            where: { name: area },
        });

        if (!areaData) {
            throw new BadRequestException("Invalid area");
        }

        const existingUser = await this.prisma.user.findFirst({
            where: { username, areaId: areaData.id },
        });

        if (existingUser) {
            throw new BadRequestException("Username already exists in this area");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await this.prisma.user.create({
            data: {
                username,
                passwordHash: hashedPassword,
                areaId: areaData.id,
            }
        });

        return { message: "User registered successfully" };
    }

    async login(dto: LoginDto) {
        const user = await this.prisma.user.findFirst({
            where: {
                username: dto.username,
                area: {
                    name: dto.area
                }
            }
        })

        if (!user) {
            throw new UnauthorizedException("Invalid credentials");
        }

        
        const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);

        if (!passwordValid) {
            throw new UnauthorizedException("Invalid credentials");
        }

        const area = await this.prisma.area.findUnique({
            where: { name: dto.area },
        });

        if (!area) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload : JwtPayload = { sub: user.id, username: user.username, areaId: area.id };
        
        const accessToken = this.jwtService.sign(payload, {
            expiresIn: "15m",
        });

        const refreshToken = this.jwtService.sign(payload, {
            expiresIn: "7d"
        });

        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

        await this.prisma.user.update({
            where: { id: user.id },
            data: { refreshToken: hashedRefreshToken },
        });

        return {
            accessToken,
            refreshToken
        }
    }

    async refreshToken(refreshToken: string) {
        try {
            const payload : JwtPayload= this.jwtService.verify(refreshToken);
    
            const user = await this.prisma.user.findUnique({
                where : { id: payload.sub }
            })
    
            if (!user || !user.refreshToken) {
                throw new UnauthorizedException("Invalid refresh token");
            }
    
            const isValid = await bcrypt.compare(refreshToken, user.refreshToken);
            if (!isValid) {
                throw new UnauthorizedException("Invalid refresh token");
            }
    
            const newAccessToken = this.jwtService.sign(
                { sub: user.id, username: user.username, areaId: user.areaId },
                { expiresIn: "15m" }
            );
    
            return { accessToken: newAccessToken };
        } catch (error) {
            throw new UnauthorizedException("Invalid refresh token");
        }
    }

    async logout(userId: any) {
        await this.prisma.user.update({
            where: { id: userId },
            data: { refreshToken: null },
        });

        return { message: "Logged out successfully" };
    }
}
