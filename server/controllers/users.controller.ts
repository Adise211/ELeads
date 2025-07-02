import { Request, Response, NextFunction } from "express";
import { User, Workspace } from "../generated/prisma";
import { getWorkspaceByName, createWorkspace } from "../models/workspace.model";
import { getUserByEmail, createUser } from "../models/users.model";
import {
  httpCodes,
  userErrorsMsg,
  workspaceErrorsMsg,
} from "../utils/errorCodes.js";
import { AppError } from "../middleware/errorHandler.middleware";
import { hashPassword } from "../utils/auth.helper";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { firstName, lastName, email, password, role, phone }: User =
      req.body.user;
    const { name }: Workspace = req.body.workspace;
    const hashedPassword = await hashPassword(password);
    let _workspaceName = name.toLocaleLowerCase();

    const isWorkspaceExisting = await getWorkspaceByName(_workspaceName);
    const isUserExisting = await getUserByEmail(email);
    // Check if workspace or user already exists
    if (isWorkspaceExisting) {
      res
        .status(httpCodes.BAD_REQUEST)
        .json({ message: workspaceErrorsMsg.WORKSPACE_ALREADY_EXISTS });
    } else if (isUserExisting) {
      res
        .status(httpCodes.BAD_REQUEST)
        .json({ message: userErrorsMsg.USER_ALREADY_EXISTS });
    } else {
      // If workspace and user do not exist, create a new user and workspace
      const user = await createUser({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
        phone,
      });
      // If user is created successfully, create a workspace for the user
      if (user) {
        const workspace = await createWorkspace(_workspaceName, user.id);
        res.status(httpCodes.CREATED).json({
          success: true,
          message: "User registered successfully",
          data: { user, workspace },
        });
      } else {
        throw new AppError(
          userErrorsMsg.INVALID_USER_DATA,
          httpCodes.INTERNAL_SERVER_ERROR
        );
      }
    }
  } catch (error) {
    next(error);
  }
};
