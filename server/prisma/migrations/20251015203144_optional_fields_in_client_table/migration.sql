/*
  Warnings:

  - Made the column `email` on table `Client` required. This step will fail if there are existing NULL values in that column.
  - Made the column `company` on table `Client` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Client" ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "email" SET DEFAULT '',
ALTER COLUMN "company" SET NOT NULL,
ALTER COLUMN "company" SET DEFAULT '';
