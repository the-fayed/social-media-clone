/*
  Warnings:

  - You are about to drop the column `privcay` on the `Story` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Story` DROP COLUMN `privcay`,
    ADD COLUMN `privacy` ENUM('public', 'followers', 'noone') NOT NULL DEFAULT 'public';
