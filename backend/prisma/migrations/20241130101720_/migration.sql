-- AlterTable
ALTER TABLE "User" ADD COLUMN     "trainerId" INTEGER;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
