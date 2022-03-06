/*
  Warnings:

  - You are about to drop the column `rollback_migrations` on the `Updates` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Updates" DROP COLUMN "rollback_migrations";
