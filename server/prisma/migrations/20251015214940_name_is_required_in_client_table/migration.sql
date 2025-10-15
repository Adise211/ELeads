/*
  Warnings:

  - Made the column `name` on table `Client` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Client" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "name" SET DEFAULT '';
