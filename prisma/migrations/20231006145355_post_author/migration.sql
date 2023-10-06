/*
  Warnings:

  - You are about to drop the column `commentAutherId` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `disc` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `disc` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `postAutherId` on the `Post` table. All the data in the column will be lost.
  - Added the required column `commentAuthorId` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `desc` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `desc` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postAuthorId` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Comment` DROP FOREIGN KEY `Comment_commentAutherId_fkey`;

-- DropForeignKey
ALTER TABLE `Post` DROP FOREIGN KEY `Post_postAutherId_fkey`;

-- AlterTable
ALTER TABLE `Comment` DROP COLUMN `commentAutherId`,
    DROP COLUMN `disc`,
    ADD COLUMN `commentAuthorId` INTEGER NOT NULL,
    ADD COLUMN `desc` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Post` DROP COLUMN `disc`,
    DROP COLUMN `postAutherId`,
    ADD COLUMN `desc` VARCHAR(191) NOT NULL,
    ADD COLUMN `postAuthorId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_postAuthorId_fkey` FOREIGN KEY (`postAuthorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_commentAuthorId_fkey` FOREIGN KEY (`commentAuthorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
