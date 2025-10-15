-- AlterTable
ALTER TABLE "public"."Billing" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "public"."Client" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "public"."Workspace" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;
