import { types } from "@eleads/shared";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createClient = async (data: types.ClientDTO, workspaceId: string, userId: string) => {
  const client = await prisma.client.create({
    data: {
      ...data,
      workspaceId: workspaceId,
      assignedToId: userId,
    },
  });
  return client;
};

export const updateClient = async (data: types.ClientDTO, workspaceId: string, userId: string) => {
  const client = await prisma.client.update({
    where: { id: data.id },
    data: { ...data, workspaceId: workspaceId, assignedToId: userId },
  });
  return client;
};

export const deleteClient = async (id: string) => {
  const client = await prisma.client.delete({ where: { id } });
  return client;
};
