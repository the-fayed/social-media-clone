/*
  Warnings:

  - You are about to drop the column `followersId` on the `Relationship` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[followerId]` on the table `Relationship` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `followerId` to the `Relationship` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Relationship` DROP FOREIGN KEY `Relationship_followersId_fkey`;

-- AlterTable
ALTER TABLE `Relationship` DROP COLUMN `followersId`,
    ADD COLUMN `followerId` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Relationship_followerId_key` ON `Relationship`(`followerId`);

-- AddForeignKey
ALTER TABLE `Relationship` ADD CONSTRAINT `Relationship_followerId_fkey` FOREIGN KEY (`followerId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
