/*
  Warnings:

  - The `permissions` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Permission" AS ENUM ('MANAGE_OWN_LEADS', 'EDIT_WORKSPACE_LEADS', 'DELETE_WORKSPACE_LEADS', 'ASSIGN_LEADS', 'MANAGE_USERS', 'VIEW_BILLING', 'CREATE_BILLING', 'EDIT_BILLING', 'DELETE_BILLING');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "permissions",
ADD COLUMN     "permissions" "Permission"[] DEFAULT ARRAY[]::"Permission"[];
