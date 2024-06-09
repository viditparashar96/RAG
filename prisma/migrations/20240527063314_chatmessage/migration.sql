/*
  Warnings:

  - You are about to drop the column `projectId` on the `ChatMessage` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[vectortable]` on the table `Project` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tableId` to the `ChatMessage` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ChatMessage" DROP CONSTRAINT "ChatMessage_projectId_fkey";

-- AlterTable
ALTER TABLE "ChatMessage" DROP COLUMN "projectId",
ADD COLUMN     "tableId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Project_vectortable_key" ON "Project"("vectortable");

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "Project"("vectortable") ON DELETE RESTRICT ON UPDATE CASCADE;
