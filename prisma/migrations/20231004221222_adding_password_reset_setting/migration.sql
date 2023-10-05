/*
  Warnings:

  - You are about to alter the column `passResetToken` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(70)`.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `passResetToken` VARCHAR(70) NULL;
