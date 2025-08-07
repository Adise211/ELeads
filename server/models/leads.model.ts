import { Lead, PrismaClient } from "@prisma/client";
import { CreateLeadInput } from "../server.types";

const prisma = new PrismaClient();

export const createLead = async (userId: string, data: CreateLeadInput) => {
  // Ensure required fields are present and types are correct
  const lead = await prisma.lead.create({
    data: {
      ...data,
      assignedToId: userId,
    },
  });
  return lead;
};

export const updateUserLead = async (userId: string, leadId: string, data: Partial<Lead>) => {
  const lead = await prisma.lead.update({
    where: { id: leadId, AND: { assignedToId: userId } },
    data,
  });
  return lead;
};
