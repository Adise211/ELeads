import { PrismaClient } from "@prisma/client";
import { types } from "@eleads/shared";

const prisma = new PrismaClient();

export const createBilling = async (data: types.BillingDTO, workspaceId: string) => {
  const { client, ...billingData } = data;
  const billing = await prisma.billing.create({
    data: {
      ...billingData,
      workspaceId: workspaceId,
    },
  });
  return billing;
};
