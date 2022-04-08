/*
  Warnings:

  - You are about to drop the column `dMId` on the `message` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `message` DROP FOREIGN KEY `Message_dMId_fkey`;

-- AlterTable
ALTER TABLE `message` DROP COLUMN `dMId`,
    ADD COLUMN `dmId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_dmId_fkey` FOREIGN KEY (`dmId`) REFERENCES `DM`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
