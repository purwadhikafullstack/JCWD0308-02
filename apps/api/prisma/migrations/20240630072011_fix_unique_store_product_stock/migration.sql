/*
  Warnings:

  - The values [FIXED_DISCOUnt] on the enum `vouchers_discount_type` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[store_id,product_id]` on the table `stock` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `order_items` DROP FOREIGN KEY `order_items_order_id_fkey`;

-- DropForeignKey
ALTER TABLE `order_items` DROP FOREIGN KEY `order_items_stock_id_fkey`;

-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `orders_store_id_fkey`;

-- DropForeignKey
ALTER TABLE `stock` DROP FOREIGN KEY `stock_product_id_fkey`;

-- DropForeignKey
ALTER TABLE `stock` DROP FOREIGN KEY `stock_store_id_fkey`;

-- DropForeignKey
ALTER TABLE `stock_mutation` DROP FOREIGN KEY `stock_mutation_order_id_fkey`;

-- DropForeignKey
ALTER TABLE `stock_mutation` DROP FOREIGN KEY `stock_mutation_stock_id_fkey`;

-- DropForeignKey
ALTER TABLE `user_vouchers` DROP FOREIGN KEY `user_vouchers_voucher_id_fkey`;

-- AlterTable
ALTER TABLE `vouchers` ADD COLUMN `image_url` VARCHAR(191) NULL,
    ADD COLUMN `store_admin_id` VARCHAR(191) NULL,
    ADD COLUMN `store_id` VARCHAR(191) NULL,
    MODIFY `super_admin_id` VARCHAR(191) NULL,
    MODIFY `discount_type` ENUM('FIXED_DISCOUNT', 'DISCOUNT') NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `stock_store_id_product_id_key` ON `stock`(`store_id`, `product_id`);

-- AddForeignKey
ALTER TABLE `stock` ADD CONSTRAINT `stock_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock` ADD CONSTRAINT `stock_store_id_fkey` FOREIGN KEY (`store_id`) REFERENCES `stores`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_mutation` ADD CONSTRAINT `stock_mutation_stock_id_fkey` FOREIGN KEY (`stock_id`) REFERENCES `stock`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_mutation` ADD CONSTRAINT `stock_mutation_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_store_id_fkey` FOREIGN KEY (`store_id`) REFERENCES `stores`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_stock_id_fkey` FOREIGN KEY (`stock_id`) REFERENCES `stock`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vouchers` ADD CONSTRAINT `vouchers_store_admin_id_fkey` FOREIGN KEY (`store_admin_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vouchers` ADD CONSTRAINT `vouchers_store_id_fkey` FOREIGN KEY (`store_id`) REFERENCES `stores`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_vouchers` ADD CONSTRAINT `user_vouchers_voucher_id_fkey` FOREIGN KEY (`voucher_id`) REFERENCES `vouchers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
