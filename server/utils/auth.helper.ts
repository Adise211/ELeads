import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import { Permission, UserRole } from "@prisma/client";

// Hashing and comparing passwords
export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}

// JWT - token generation and verification
const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || "1h") as SignOptions["expiresIn"];

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;
const JWT_REFRESH_EXPIRES_IN = (process.env.JWT_REFRESH_EXPIRES_IN ||
  "7d") as SignOptions["expiresIn"];

// Generate access token
export function generateAccessToken(payload: object): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Generate refresh token
export function generateRefreshToken(payload: object): string {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
  });
}

// Verify access token
export function verifyAccessToken(token: string): any {
  return jwt.verify(token, JWT_SECRET);
}

// Verify refresh token
export function verifyRefreshToken(token: string): any {
  return jwt.verify(token, JWT_REFRESH_SECRET);
}

// TODO: Move it in the future to: /lib/auth/hasPermission.ts
export const rolePermissionMap: Record<UserRole, Permission[]> = {
  ADMIN: [
    Permission.MANAGE_OWN_LEADS,
    Permission.EDIT_WORKSPACE_LEADS,
    Permission.DELETE_WORKSPACE_LEADS,
    Permission.ASSIGN_LEADS,
    Permission.MANAGE_USERS,
    Permission.VIEW_BILLING,
    Permission.CREATE_BILLING,
    Permission.EDIT_BILLING,
    Permission.DELETE_BILLING,
  ],
  MANAGER: [Permission.MANAGE_OWN_LEADS, Permission.ASSIGN_LEADS],
  USER: [Permission.MANAGE_OWN_LEADS],
};

export function hasPermission(
  user: { role: UserRole; permissions?: Permission[] },
  action: Permission
): boolean {
  // If user has explicit permission (manual override)
  if (user.permissions?.includes(action)) return true;

  // Fallback to role-based permissions
  return rolePermissionMap[user.role]?.includes(action) ?? false;
}
