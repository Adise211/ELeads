import { types } from "@eleads/shared";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createClient = async (data: types.ClientDTO, workspaceId: string, userId: string) => {
  // Validate leadId exists if provided
  if (data.leadId) {
    const lead = await prisma.lead.findUnique({
      where: { id: data.leadId },
    });

    if (!lead) {
      throw new Error(`Lead with id ${data.leadId} does not exist`);
    }
  }

  // Prepare data object, excluding leadId if it's null/undefined
  const clientData = {
    ...data,
    workspaceId: workspaceId,
    assignedToId: userId,
  };

  // Remove leadId if it's null or undefined to avoid foreign key constraint
  if (!clientData.leadId) {
    delete clientData.leadId;
  }

  const client = await prisma.client.create({
    data: clientData,
  });
  return client;
};

export const updateClient = async (data: types.ClientDTO, workspaceId: string, userId: string) => {
  // Validate leadId exists if provided
  if (data.leadId) {
    const lead = await prisma.lead.findUnique({
      where: { id: data.leadId },
    });

    if (!lead) {
      throw new Error(`Lead with id ${data.leadId} does not exist`);
    }
  }

  // Prepare data object, excluding leadId if it's null/undefined
  const clientData = {
    ...data,
    workspaceId: workspaceId,
    assignedToId: userId,
  };

  // Remove leadId if it's null or undefined to avoid foreign key constraint
  if (!clientData.leadId) {
    delete clientData.leadId;
  }

  const client = await prisma.client.update({
    where: { id: data.id },
    data: clientData,
  });
  return client;
};

export const deleteClient = async (id: string, workspaceId: string, userId: string) => {
  const client = await prisma.client.delete({ where: { id, workspaceId, assignedToId: userId } });
  return client;
};
