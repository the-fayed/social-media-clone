/*
  Warnings:

  - You are about to drop the column `userId` on the `Story` table. All the data in the column will be lost.
  - Added the required column `storyAuthorId` to the `Story` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Story` DROP FOREIGN KEY `Story_userId_fkey`;

-- AlterTable
ALTER TABLE `Story` DROP COLUMN `userId`,
    ADD COLUMN `storyAuthorId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Story` ADD CONSTRAINT `Story_storyAuthorId_fkey` FOREIGN KEY (`storyAuthorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
