-- AlterTable
ALTER TABLE `User` ADD COLUMN `role` ENUM('User', 'Admin') NOT NULL DEFAULT 'User';
