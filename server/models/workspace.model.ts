import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create a new workspace
export const createWorkspace = async (name: string) => {
  const workspace = await prisma.workspace.create({
    data: { name },
  });
  return workspace;
};

// Create a new workspace with a user
export const createWorkspaceWithUser = async (name: string, userId: string) => {
  const workspace = await prisma.workspace.create({
    data: {
      name,
      users: {
        connect: { id: userId },
      },
    },
  });
  return workspace;
};

// Get a workspace by ID
export const getWorkspaceById = async (workspaceId: string) => {
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
  });
  return workspace;
};

// Get all workspaces for a user
export const getWorkspacesByUserId = async (userId: string) => {
  const workspaces = await prisma.workspace.findMany({
    where: {
      users: {
        some: {
          id: userId,
        },
      },
    },
  });
  return workspaces;
};

// Update a workspace (admin role only)
export const updateWorkspace = async (workspaceId: string, data: any) => {
  const workspace = await prisma.workspace.update({
    where: { id: workspaceId },
    data,
  });
  return workspace;
};

// Delete a workspace (admin role only)
export const deleteWorkspace = async (workspaceId: string) => {
  const workspace = await prisma.workspace.delete({
    where: { id: workspaceId },
  });
  return workspace;
};

// Add a user to a workspace (admin role only)
export const addUserToWorkspace = async (workspaceId: string, userId: string) => {
  const workspace = await prisma.workspace.update({
    where: { id: workspaceId },
    data: {
      users: {
        connect: { id: userId },
      },
    },
  });
  return workspace;
};

// Remove a user from a workspace (admin role only)
export const removeUserFromWorkspace = async (workspaceId: string, userId: string) => {
  const workspace = await prisma.workspace.update({
    where: { id: workspaceId },
    data: {
      users: {
        disconnect: { id: userId },
      },
    },
  });
  return workspace;
};

// Get all users in a workspace
export const getWorkspaceUsers = async (workspaceId: string) => {
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
    include: { users: true },
  });
  return workspace?.users || [];
};

// Get a workspace by name
export const getWorkspaceByName = async (name: string) => {
  const workspace = await prisma.workspace.findFirst({
    where: { name },
  });
  return workspace;
};

// Get all leads in a workspace
export const getWorkspaceLeads = async (workspaceId: string) => {
  const leads = await prisma.lead.findMany({
    where: {
      workspaceId,
    },
  });
  return leads;
};
