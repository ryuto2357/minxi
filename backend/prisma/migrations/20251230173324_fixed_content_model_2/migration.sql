/*
  Warnings:

  - You are about to drop the column `publishedAt` on the `content` table. All the data in the column will be lost.
  - You are about to drop the column `publishedAt` on the `post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `content` DROP COLUMN `publishedAt`;

-- AlterTable
ALTER TABLE `post` DROP COLUMN `publishedAt`;
