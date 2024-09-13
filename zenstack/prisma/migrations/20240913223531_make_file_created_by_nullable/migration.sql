-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_createdById_fkey";

-- AlterTable
ALTER TABLE "File" ALTER COLUMN "createdById" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
