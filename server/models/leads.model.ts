import { Lead, PrismaClient } from "@prisma/client";
import { CreateLeadInput } from "../server.types";

const prisma = new PrismaClient();

export const createLead = async (userId: string, workspaceId: string, data: CreateLeadInput) => {
  const lead = await prisma.lead.create({
    data: {
      ...data,
      assignedToId: userId,
      workspaceId: workspaceId,
    },
  });
  return lead;
};

export const updateUserLead = async (
  assignedToId: string,
  workspaceId: string,
  data: Partial<Lead>
) => {
  const lead = await prisma.lead.update({
    where: { id: data.id, AND: { assignedToId: assignedToId, workspaceId: workspaceId } },
    data,
  });
  return lead;
};
// soft delete (isActive = false)!!!
export const deleteUserLead = async (workspaceId: string, id: string) => {
  const lead = await prisma.lead.update({
    where: { id: id, AND: { workspaceId: workspaceId } },
    data: {
      isActive: false,
    },
  });
  return lead;
};
