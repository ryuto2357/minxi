import { PrismaClient } from './generated/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT),
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
})
const prisma = new PrismaClient({ adapter })

async function main() {
  await prisma.area.createMany({
    data: [
      { name: "China" },
      { name: "America" },
      { name: "Indonesia" },
    ],
    skipDuplicates: true,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

export {};