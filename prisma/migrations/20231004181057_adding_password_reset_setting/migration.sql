-- AlterTable
ALTER TABLE `User` ADD COLUMN `passChangedAt` DATETIME(3) NULL,
    ADD COLUMN `passResetCodeVerified` BOOLEAN NULL,
    ADD COLUMN `passResetToken` VARCHAR(191) NULL,
    ADD COLUMN `passResetTokenExpire` DATETIME(3) NULL;
