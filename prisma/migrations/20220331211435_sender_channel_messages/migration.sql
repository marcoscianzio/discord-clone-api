/*
  Warnings:

  - Added the required column `senderId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `message` ADD COLUMN `dMId` VARCHAR(191) NULL,
    ADD COLUMN `senderId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_dMId_fkey` FOREIGN KEY (`dMId`) REFERENCES `DM`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
