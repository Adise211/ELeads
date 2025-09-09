-- Rename column to preserve existing data
ALTER TABLE "public"."Billing" RENAME COLUMN "userPercentage" TO "userCommission";
