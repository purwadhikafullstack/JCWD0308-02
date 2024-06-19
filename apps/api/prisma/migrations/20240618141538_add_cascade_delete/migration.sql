/*
  Warnings:

  - You are about to drop the column `packWeight` on the `products` table. All the data in the column will be lost.
  - You are about to alter the column `weight` on the `products` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - Added the required column `weight_pack` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `products` DROP FOREIGN KEY `products_category_id_fkey`;

-- AlterTable
ALTER TABLE `products` DROP COLUMN `packWeight`,
    ADD COLUMN `weight_pack` DOUBLE NOT NULL,
    MODIFY `weight` DOUBLE NOT NULL;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
