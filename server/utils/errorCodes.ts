const userErrorsMsg = {
  USER_NOT_FOUND: "User not found",
  USER_ALREADY_EXISTS: "User already exists",
  INVALID_USER_DATA: "Invalid user data",
  INVALID_PASSWORD: "Invalid password",
  UNAUTHORIZED: "Unauthorized access",
};

const workspaceErrorsMsg = {
  WORKSPACE_NOT_FOUND: "Workspace not found",
  WORKSPACE_ALREADY_EXISTS: "Workspace already exists",
  INVALID_WORKSPACE_DATA: "Invalid workspace data",
};

const commonErrorsMsg = {
  DATABASE_ERROR: "Database operation failed",
  UNAUTHORIZED: "Unauthorized access",
  FORBIDDEN: "Forbidden access",
  NOT_FOUND: "Resource not found",
  INTERNAL_SERVER_ERROR: "Internal server error",
};

const prismaErrorCodes = {
  USER_NOT_FOUND: "P2001",
  USER_ALREADY_EXISTS: "P2002",
  INVALID_USER_DATA: "P2003",
  WORKSPACE_NOT_FOUND: "P2004",
  WORKSPACE_ALREADY_EXISTS: "P2005",
  INVALID_WORKSPACE_DATA: "P2006",
  DATABASE_ERROR: "P2007",
  UNAUTHORIZED: "P2008",
  FORBIDDEN: "P2009",
  NOT_FOUND: "P2010",
  INTERNAL_SERVER_ERROR: "P2011",
  INVALID_INPUT: "P2012",
  RECORD_NOT_FOUND: "P2013",
};

const httpCodes = {
  SUCCESS: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  NOT_FOUND: 404,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  INTERNAL_SERVER_ERROR: 500,
};

export {
  userErrorsMsg,
  workspaceErrorsMsg,
  commonErrorsMsg,
  prismaErrorCodes,
  httpCodes,
};
