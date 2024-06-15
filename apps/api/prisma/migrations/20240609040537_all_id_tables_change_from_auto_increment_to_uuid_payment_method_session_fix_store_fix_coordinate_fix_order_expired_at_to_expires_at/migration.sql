/*
  Warnings:

  - The primary key for the `categories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `login_attempts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `expired_at` on the `login_attempts` table. All the data in the column will be lost.
  - You are about to drop the column `expired_code` on the `login_attempts` table. All the data in the column will be lost.
  - The primary key for the `order_items` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `orders` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `product_images` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `products` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `stock` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `stock_mutation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `store_admins` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `stores` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `latitude` on the `stores` table. All the data in the column will be lost.
  - You are about to drop the column `longtitude` on the `stores` table. All the data in the column will be lost.
  - The primary key for the `user_addresses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `latitude` on the `user_addresses` table. All the data in the column will be lost.
  - You are about to drop the column `longtitude` on the `user_addresses` table. All the data in the column will be lost.
  - The primary key for the `user_vouchers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `expired_at` on the `user_vouchers` table. All the data in the column will be lost.
  - You are about to drop the column `expired_code` on the `user_vouchers` table. All the data in the column will be lost.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `vouchers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `expired_at` on the `vouchers` table. All the data in the column will be lost.
  - You are about to drop the column `expired_code` on the `vouchers` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[expires_code]` on the table `login_attempts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `stores` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `stores` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[expires_code]` on the table `user_vouchers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[expires_code]` on the table `vouchers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `expires_at` to the `login_attempts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payment_method` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `coordinate` to the `stores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `stores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `coordinate` to the `user_addresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expires_at` to the `user_vouchers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expires_at` to the `vouchers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `categories` DROP FOREIGN KEY `categories_super_admin_id_fkey`;

-- DropForeignKey
ALTER TABLE `login_attempts` DROP FOREIGN KEY `login_attempts_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `order_items` DROP FOREIGN KEY `order_items_order_id_fkey`;

-- DropForeignKey
ALTER TABLE `order_items` DROP FOREIGN KEY `order_items_stock_id_fkey`;

-- DropForeignKey
ALTER TABLE `order_items` DROP FOREIGN KEY `order_items_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `orders_store_admin_id_fkey`;

-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `orders_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `product_images` DROP FOREIGN KEY `product_images_product_id_fkey`;

-- DropForeignKey
ALTER TABLE `products` DROP FOREIGN KEY `products_category_id_fkey`;

-- DropForeignKey
ALTER TABLE `products` DROP FOREIGN KEY `products_super_admin_id_fkey`;

-- DropForeignKey
ALTER TABLE `stock` DROP FOREIGN KEY `stock_product_id_fkey`;

-- DropForeignKey
ALTER TABLE `stock` DROP FOREIGN KEY `stock_store_id_fkey`;

-- DropForeignKey
ALTER TABLE `stock_mutation` DROP FOREIGN KEY `stock_mutation_admin_id_fkey`;

-- DropForeignKey
ALTER TABLE `stock_mutation` DROP FOREIGN KEY `stock_mutation_order_id_fkey`;

-- DropForeignKey
ALTER TABLE `stock_mutation` DROP FOREIGN KEY `stock_mutation_stock_id_fkey`;

-- DropForeignKey
ALTER TABLE `store_admins` DROP FOREIGN KEY `store_admins_store_admin_id_fkey`;

-- DropForeignKey
ALTER TABLE `store_admins` DROP FOREIGN KEY `store_admins_store_id_fkey`;

-- DropForeignKey
ALTER TABLE `stores` DROP FOREIGN KEY `stores_super_admin_id_fkey`;

-- DropForeignKey
ALTER TABLE `user_addresses` DROP FOREIGN KEY `user_addresses_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `user_vouchers` DROP FOREIGN KEY `user_vouchers_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `user_vouchers` DROP FOREIGN KEY `user_vouchers_voucher_id_fkey`;

-- DropForeignKey
ALTER TABLE `vouchers` DROP FOREIGN KEY `vouchers_super_admin_id_fkey`;

-- DropIndex
DROP INDEX `login_attempts_expired_code_key` ON `login_attempts`;

-- DropIndex
DROP INDEX `user_vouchers_expired_code_key` ON `user_vouchers`;

-- DropIndex
DROP INDEX `vouchers_expired_code_key` ON `vouchers`;

-- AlterTable
ALTER TABLE `categories` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `super_admin_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `login_attempts` DROP PRIMARY KEY,
    DROP COLUMN `expired_at`,
    DROP COLUMN `expired_code`,
    ADD COLUMN `expires_at` DATETIME(3) NOT NULL,
    ADD COLUMN `expires_code` VARCHAR(191) NULL,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `user_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `order_items` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `user_id` VARCHAR(191) NOT NULL,
    MODIFY `order_id` VARCHAR(191) NULL,
    MODIFY `stock_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `orders` DROP PRIMARY KEY,
    ADD COLUMN `payment_method` ENUM('MANUAL', 'GATEWAY') NOT NULL,
    ADD COLUMN `store_id` VARCHAR(191) NULL,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `user_id` VARCHAR(191) NOT NULL,
    MODIFY `store_admin_id` VARCHAR(191) NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `product_images` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `product_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `products` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `super_admin_id` VARCHAR(191) NOT NULL,
    MODIFY `category_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `stock` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `product_id` VARCHAR(191) NOT NULL,
    MODIFY `store_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `stock_mutation` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `stock_id` VARCHAR(191) NOT NULL,
    MODIFY `admin_id` VARCHAR(191) NULL,
    MODIFY `order_id` VARCHAR(191) NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `store_admins` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `store_id` VARCHAR(191) NOT NULL,
    MODIFY `store_admin_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `stores` DROP PRIMARY KEY,
    DROP COLUMN `latitude`,
    DROP COLUMN `longtitude`,
    ADD COLUMN `coordinate` LONGTEXT NOT NULL,
    ADD COLUMN `slug` VARCHAR(191) NOT NULL,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `super_admin_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `user_addresses` DROP PRIMARY KEY,
    DROP COLUMN `latitude`,
    DROP COLUMN `longtitude`,
    ADD COLUMN `coordinate` LONGTEXT NOT NULL,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `user_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `user_vouchers` DROP PRIMARY KEY,
    DROP COLUMN `expired_at`,
    DROP COLUMN `expired_code`,
    ADD COLUMN `expires_at` DATETIME(3) NOT NULL,
    ADD COLUMN `expires_code` VARCHAR(191) NULL,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `voucher_id` VARCHAR(191) NOT NULL,
    MODIFY `user_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `users` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `vouchers` DROP PRIMARY KEY,
    DROP COLUMN `expired_at`,
    DROP COLUMN `expired_code`,
    ADD COLUMN `expires_at` DATETIME(3) NOT NULL,
    ADD COLUMN `expires_code` VARCHAR(191) NULL,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `super_admin_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- CreateTable
CREATE TABLE `sessions` (
    `id` VARCHAR(191) NOT NULL,
    `expires_at` DATETIME(3) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `login_attempts_expires_code_key` ON `login_attempts`(`expires_code`);

-- CreateIndex
CREATE UNIQUE INDEX `stores_name_key` ON `stores`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `stores_slug_key` ON `stores`(`slug`);

-- CreateIndex
CREATE UNIQUE INDEX `user_vouchers_expires_code_key` ON `user_vouchers`(`expires_code`);

-- CreateIndex
CREATE UNIQUE INDEX `vouchers_expires_code_key` ON `vouchers`(`expires_code`);

-- AddForeignKey
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `login_attempts` ADD CONSTRAINT `login_attempts_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_addresses` ADD CONSTRAINT `user_addresses_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stores` ADD CONSTRAINT `stores_super_admin_id_fkey` FOREIGN KEY (`super_admin_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `store_admins` ADD CONSTRAINT `store_admins_store_id_fkey` FOREIGN KEY (`store_id`) REFERENCES `stores`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `store_admins` ADD CONSTRAINT `store_admins_store_admin_id_fkey` FOREIGN KEY (`store_admin_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `categories` ADD CONSTRAINT `categories_super_admin_id_fkey` FOREIGN KEY (`super_admin_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_super_admin_id_fkey` FOREIGN KEY (`super_admin_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_images` ADD CONSTRAINT `product_images_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock` ADD CONSTRAINT `stock_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock` ADD CONSTRAINT `stock_store_id_fkey` FOREIGN KEY (`store_id`) REFERENCES `stores`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_mutation` ADD CONSTRAINT `stock_mutation_stock_id_fkey` FOREIGN KEY (`stock_id`) REFERENCES `stock`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_mutation` ADD CONSTRAINT `stock_mutation_admin_id_fkey` FOREIGN KEY (`admin_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_mutation` ADD CONSTRAINT `stock_mutation_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_store_admin_id_fkey` FOREIGN KEY (`store_admin_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_store_id_fkey` FOREIGN KEY (`store_id`) REFERENCES `stores`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_stock_id_fkey` FOREIGN KEY (`stock_id`) REFERENCES `stock`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vouchers` ADD CONSTRAINT `vouchers_super_admin_id_fkey` FOREIGN KEY (`super_admin_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_vouchers` ADD CONSTRAINT `user_vouchers_voucher_id_fkey` FOREIGN KEY (`voucher_id`) REFERENCES `vouchers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_vouchers` ADD CONSTRAINT `user_vouchers_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
