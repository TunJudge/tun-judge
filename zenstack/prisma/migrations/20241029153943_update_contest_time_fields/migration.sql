/*
  Warnings:

  - Made the column `freezeTime` on table `Contest` required. This step will fail if there are existing NULL values in that column.
  - Made the column `endTime` on table `Contest` required. This step will fail if there are existing NULL values in that column.
  - Made the column `unfreezeTime` on table `Contest` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Contest" ALTER COLUMN "freezeTime" SET NOT NULL,
ALTER COLUMN "endTime" SET NOT NULL,
ALTER COLUMN "unfreezeTime" SET NOT NULL;
