/*
  Warnings:

  - A unique constraint covering the columns `[github_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[google_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `product_images` DROP FOREIGN KEY `product_images_product_id_fkey`;

-- DropIndex
DROP INDEX `users_contact_email_key` ON `users`;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `github_id` VARCHAR(191) NULL,
    ADD COLUMN `google_id` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `users_github_id_key` ON `users`(`github_id`);

-- CreateIndex
CREATE UNIQUE INDEX `users_google_id_key` ON `users`(`google_id`);

-- AddForeignKey
ALTER TABLE `product_images` ADD CONSTRAINT `product_images_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
