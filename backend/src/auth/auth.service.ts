import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) {}

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
}
