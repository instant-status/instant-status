/*
  Warnings:

  - You are about to drop the column `updatesId` on the `Updates` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Updates" DROP CONSTRAINT "Updates_updatesId_fkey";

-- AlterTable
ALTER TABLE "Updates" DROP COLUMN "updatesId";

-- AddForeignKey
ALTER TABLE "Updates" ADD FOREIGN KEY ("id") REFERENCES "Updates"("id") ON DELETE CASCADE ON UPDATE CASCADE;
