/*
  Warnings:

  - The values [FIXED_DISCOUnt] on the enum `vouchers_discount_type` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `label_address` to the `user_addresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipient_name` to the `user_addresses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `stores` ADD COLUMN `latitude` LONGTEXT NULL,
    ADD COLUMN `longitude` LONGTEXT NULL;

-- AlterTable
ALTER TABLE `user_addresses` ADD COLUMN `label_address` VARCHAR(191) NOT NULL,
    ADD COLUMN `latitude` LONGTEXT NULL,
    ADD COLUMN `longitude` LONGTEXT NULL,
    ADD COLUMN `phone` VARCHAR(191) NULL,
    ADD COLUMN `recipient_name` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `display_name` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `vouchers` ADD COLUMN `image_url` VARCHAR(191) NULL,
    ADD COLUMN `store_admin_id` VARCHAR(191) NULL,
    ADD COLUMN `store_id` VARCHAR(191) NULL,
    MODIFY `super_admin_id` VARCHAR(191) NULL,
    MODIFY `discount_type` ENUM('FIXED_DISCOUNT', 'DISCOUNT') NOT NULL;

-- CreateTable
CREATE TABLE `user_tokens` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `type` ENUM('REGISTER', 'RESET', 'EMAIL') NOT NULL DEFAULT 'REGISTER',
    `token` VARCHAR(128) NOT NULL,
    `token_expires_at` DATETIME(3) NOT NULL,
    `new_email` VARCHAR(191) NULL,
    `updated_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `user_tokens_token_key`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_tokens` ADD CONSTRAINT `user_tokens_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vouchers` ADD CONSTRAINT `vouchers_store_admin_id_fkey` FOREIGN KEY (`store_admin_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vouchers` ADD CONSTRAINT `vouchers_store_id_fkey` FOREIGN KEY (`store_id`) REFERENCES `stores`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
