-- AlterTable
ALTER TABLE `users` MODIFY `account_type` ENUM('EMAIL', 'GOOGLE', 'FACEBOOK', 'GITHUB') NOT NULL DEFAULT 'EMAIL';
