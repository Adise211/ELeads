import { PrismaClient } from "@prisma/client";
import { types } from "@eleads/shared";

const prisma = new PrismaClient();

export const createBilling = async (data: types.BillingDTO, workspaceId: string) => {
  const billing = await prisma.billing.create({
    data: {
      ...data,
      workspaceId: workspaceId,
    },
  });
  return billing;
};
