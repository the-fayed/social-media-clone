/*
  Warnings:

  - You are about to drop the column `Privacy` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Post` DROP COLUMN `Privacy`,
    ADD COLUMN `privacy` ENUM('public', 'followers', 'noone') NOT NULL DEFAULT 'public';
