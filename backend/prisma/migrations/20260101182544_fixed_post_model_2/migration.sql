/*
  Warnings:

  - You are about to drop the column `ownerId` on the `board` table. All the data in the column will be lost.
  - You are about to drop the column `thumbnail` on the `board` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Board` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `board` DROP FOREIGN KEY `Board_ownerId_fkey`;

-- DropIndex
DROP INDEX `Board_ownerId_fkey` ON `board`;

-- AlterTable
ALTER TABLE `board` DROP COLUMN `ownerId`,
    DROP COLUMN `thumbnail`,
    ADD COLUMN `userId` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `Board_userId_idx` ON `Board`(`userId`);

-- AddForeignKey
ALTER TABLE `Board` ADD CONSTRAINT `Board_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RedefineIndex
CREATE INDEX `Board_areaId_idx` ON `Board`(`areaId`);
-- DROP INDEX `Board_areaId_fkey` ON `board`;
