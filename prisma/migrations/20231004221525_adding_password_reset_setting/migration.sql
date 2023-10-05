-- AlterTable
ALTER TABLE `User` MODIFY `passResetToken` VARCHAR(191) NULL,
    MODIFY `passResetTokenExpire` VARCHAR(191) NULL;
