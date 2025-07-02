import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

// Create a new user
export const createUser = async (data: any) => {
  const user = await prisma.user.create({
    data,
  });
  return user;
};

// Get a user by ID
export const getUserById = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  return user;
};

// Get a user by email
export const getUserByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  return user;
};

// Update a user
export const updateUser = async (userId: string, data: Record<string, any>) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data,
  });
  return user;
};

// Delete a user
export const deleteUser = async (userId: string) => {
  const user = await prisma.user.delete({
    where: { id: userId },
  });
  return user;
};

// Get all users
export const getAllUsers = async () => {
  const users = await prisma.user.findMany();
  return users;
};

// Get users by workspace ID
export const getUsersByWorkspaceId = async (workspaceId: string) => {
  const users = await prisma.user.findMany({
    where: { workspaceId },
  });
  return users;
};
