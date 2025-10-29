import { PrismaClient } from "@prisma/client";
import { types } from "@eleads/shared";

const prisma = new PrismaClient();

export const createBilling = async (data: types.BillingDTO, workspaceId: string) => {
  const { client, ...billingData } = data;
  const billing = await prisma.billing.create({
    data: {
      ...billingData,
      clientId: billingData.clientId!,
      workspaceId: workspaceId,
    },
    include: {
      client: true,
    },
  });

  // Convert Decimal fields back to numbers - Only for the fields that are Decimal (because Prisma converts Decimal to string )
  return {
    ...billing,
    billedAmount: Number(billing.billedAmount),
    userCommission: Number(billing.userCommission),
  };
};

export const updateBilling = async (data: types.BillingDTO, workspaceId: string) => {
  const { client, ...billingData } = data;
  // Convert the billingDate and billingDueDate to ISO string
  billingData.billingDate = new Date(billingData.billingDate).toISOString();
  billingData.billingDueDate = new Date(billingData.billingDueDate).toISOString();

  const billing = await prisma.billing.update({
    where: { id: billingData.id },
    data: {
      ...billingData,
      clientId: billingData.clientId!,
      workspaceId: workspaceId,
    },
    include: {
      client: true,
    },
  });

  return {
    ...billing,
    billedAmount: Number(billing.billedAmount),
    userCommission: Number(billing.userCommission),
  };
};

export const deleteBilling = async (id: string, workspaceId: string) => {
  const billing = await prisma.billing.delete({
    where: { id, workspaceId },
  });
  return billing;
};
