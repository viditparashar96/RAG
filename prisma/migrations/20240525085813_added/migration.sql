/*
  Warnings:

  - You are about to drop the column `tableNames` on the `Project` table. All the data in the column will be lost.
  - Added the required column `vectortable` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "tableNames",
ADD COLUMN     "vectortable" TEXT NOT NULL;
