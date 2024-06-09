-- CreateEnum
CREATE TYPE "Status" AS ENUM ('CREATING', 'FAILED', 'COMPLETED');

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'CREATING';
