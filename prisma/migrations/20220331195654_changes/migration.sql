/*
  Warnings:

  - You are about to drop the column `active` on the `dm` table. All the data in the column will be lost.
  - You are about to drop the column `user1Id` on the `dm` table. All the data in the column will be lost.
  - You are about to drop the column `user2Id` on the `dm` table. All the data in the column will be lost.
  - The values [DONOTDISTURB] on the enum `User_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- DropForeignKey
ALTER TABLE `dm` DROP FOREIGN KEY `DM_user1Id_fkey`;

-- DropForeignKey
ALTER TABLE `dm` DROP FOREIGN KEY `DM_user2Id_fkey`;

-- AlterTable
ALTER TABLE `dm` DROP COLUMN `active`,
    DROP COLUMN `user1Id`,
    DROP COLUMN `user2Id`,
    ADD COLUMN `lastMessageDate` DATETIME(3) NULL,
    ADD COLUMN `type` ENUM('GROUP', 'ONE_TO_ONE') NOT NULL DEFAULT 'ONE_TO_ONE';

-- AlterTable
ALTER TABLE `user` MODIFY `status` ENUM('ONLINE', 'IDLE', 'DO_NOT_DISTURB', 'INVISIBLE') NOT NULL DEFAULT 'ONLINE';

-- CreateTable
CREATE TABLE `_DMs` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_DMs_AB_unique`(`A`, `B`),
    INDEX `_DMs_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_VisibleDMs` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_VisibleDMs_AB_unique`(`A`, `B`),
    INDEX `_VisibleDMs_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_DMs` ADD FOREIGN KEY (`A`) REFERENCES `DM`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DMs` ADD FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_VisibleDMs` ADD FOREIGN KEY (`A`) REFERENCES `DM`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_VisibleDMs` ADD FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
