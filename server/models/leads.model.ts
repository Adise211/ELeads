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

export const updateUserLead = async (assignedToId: string, workspaceId: string, data: any) => {
  // Extract only the fields that should be updated, excluding notes and assignedTo
  const { notes, assignedTo, ...updateData } = data;

  const lead = await prisma.lead.update({
    where: { id: data.id, AND: { assignedToId: assignedToId, workspaceId: workspaceId } },
    data: updateData,
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

// Note operations - TODO: Move to separate file

// create note
export const createNote = async (leadId: string, content: string) => {
  const note = await prisma.note.create({
    data: {
      content,
      leadId,
    },
  });
  return note;
};

// update note
export const updateNote = async (noteId: string, content: string) => {
  const note = await prisma.note.update({
    where: { id: noteId },
    data: { content },
  });
  return note;
};

// delete note
export const deleteNote = async (noteId: string) => {
  const note = await prisma.note.delete({
    where: { id: noteId },
  });
  return note;
};

export const getLeadWithNotes = async (leadId: string, workspaceId: string) => {
  const lead = await prisma.lead.findFirst({
    where: {
      id: leadId,
      workspaceId: workspaceId,
      isActive: true,
    },
    include: {
      notes: {
        orderBy: { createdAt: "asc" },
      },
      assignedTo: true,
    },
  });
  return lead;
};

// get notes for a lead
export const getLeadNotes = async (leadId: string, workspaceId: string, userId: string) => {
  const notes = await prisma.note.findMany({
    where: {
      leadId: leadId,
      lead: {
        workspaceId: workspaceId,
        isActive: true,
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return notes;
};

// get note by id
export const getNoteById = async (noteId: string, workspaceId: string) => {
  const note = await prisma.note.findFirst({
    where: {
      id: noteId,
      lead: {
        workspaceId: workspaceId,
      },
    },
    include: {
      lead: true,
    },
  });

  return note;
};
