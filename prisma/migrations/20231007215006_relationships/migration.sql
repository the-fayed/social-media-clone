/*
  Warnings:

  - You are about to drop the column `followersIds` on the `Relationship` table. All the data in the column will be lost.
  - Added the required column `followersId` to the `Relationship` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Relationship` DROP FOREIGN KEY `Relationship_followersIds_fkey`;

-- AlterTable
ALTER TABLE `Relationship` DROP COLUMN `followersIds`,
    ADD COLUMN `followersId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Relationship` ADD CONSTRAINT `Relationship_followersId_fkey` FOREIGN KEY (`followersId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
