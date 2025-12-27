import "dotenv/config";
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from 'prisma/generated/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    constructor() {
        console.log("DB HOST:", process.env.DB_HOST);
        const adapter = new PrismaMariaDb({
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            user: process.env.DB_USER,
            database: process.env.DB_NAME,
        });
        super( { adapter } );
    }

    async onModuleInit() {
        await this.$connect();
    }
}
