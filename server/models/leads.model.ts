import { ActivityType, Lead, PrismaClient } from "@prisma/client";
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

export const getLeadById = async (leadId: string, workspaceId: string) => {
  const lead = await prisma.lead.findFirst({
    where: { id: leadId, workspaceId: workspaceId, isActive: true },
    include: {
      activities: {
        orderBy: { createdAt: "desc" },
      },
      notes: {
        orderBy: { createdAt: "asc" },
      },
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

// Activity operations

// create activity
export const createActivity = async (
  leadId: string,
  userId: string,
  type: string,
  description: string
) => {
  const activity = await prisma.activity.create({
    data: {
      type: type as ActivityType,
      description,
      leadId,
      userId,
    },
  });
  return activity;
};

// update activity
export const updateActivity = async (activityId: string, type: string, description: string) => {
  const activity = await prisma.activity.update({
    where: { id: activityId },
    data: { type: type as ActivityType, description },
  });
  return activity;
};

// delete activity
export const deleteActivity = async (activityId: string) => {
  const activity = await prisma.activity.delete({
    where: { id: activityId },
  });
  return activity;
};

// get activity by id
export const getActivityById = async (activityId: string, workspaceId: string) => {
  const activity = await prisma.activity.findFirst({
    where: {
      id: activityId,
      lead: {
        workspaceId: workspaceId,
      },
    },
    include: {
      lead: true,
      user: true,
    },
  });

  return activity;
};
