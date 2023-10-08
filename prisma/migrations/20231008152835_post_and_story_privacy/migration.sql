-- AlterTable
ALTER TABLE `Post` ADD COLUMN `postPrivacy` ENUM('puplic', 'followers', 'noone') NOT NULL DEFAULT 'puplic';

-- AlterTable
ALTER TABLE `Story` ADD COLUMN `pricay` ENUM('puplic', 'followers', 'noone') NOT NULL DEFAULT 'puplic';
