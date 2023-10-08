/*
  Warnings:

  - You are about to drop the column `postPrivacy` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `pricay` on the `Story` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Post` DROP COLUMN `postPrivacy`,
    ADD COLUMN `Privacy` ENUM('public', 'followers', 'noone') NOT NULL DEFAULT 'public';

-- AlterTable
ALTER TABLE `Story` DROP COLUMN `pricay`,
    ADD COLUMN `privcay` ENUM('public', 'followers', 'noone') NOT NULL DEFAULT 'public';
