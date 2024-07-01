/*
  Warnings:

  - You are about to drop the column `github_id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `google_id` on the `users` table. All the data in the column will be lost.
  - The values [FACEBOOK] on the enum `users_account_type` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[provider_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `users_github_id_key` ON `users`;

-- DropIndex
DROP INDEX `users_google_id_key` ON `users`;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `github_id`,
    DROP COLUMN `google_id`,
    ADD COLUMN `provider_id` VARCHAR(191) NULL,
    MODIFY `account_type` ENUM('EMAIL', 'GOOGLE', 'GITHUB') NOT NULL DEFAULT 'EMAIL';

-- CreateIndex
CREATE UNIQUE INDEX `users_provider_id_key` ON `users`(`provider_id`);
