/*
  Warnings:

  - You are about to alter the column `postPrivacy` on the `Post` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `Enum(EnumId(2))`.
  - You are about to alter the column `pricay` on the `Story` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `Enum(EnumId(2))`.

*/
-- AlterTable
ALTER TABLE `Post` MODIFY `postPrivacy` ENUM('public', 'followers', 'noone') NOT NULL DEFAULT 'public';

-- AlterTable
ALTER TABLE `Story` MODIFY `pricay` ENUM('public', 'followers', 'noone') NOT NULL DEFAULT 'public';
