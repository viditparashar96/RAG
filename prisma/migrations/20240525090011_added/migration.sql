/*
  Warnings:

  - Added the required column `pdf_file_key` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "pdf_file_key" TEXT NOT NULL;
