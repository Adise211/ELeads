# Services Layer

This directory contains the organized service layer for API communication in the ELeads application.

## Structure

```
services/
├── httpConfig.ts          # Axios configuration with interceptors
├── api/                   # API service modules
│   ├── auth.service.ts    # Authentication related API calls
│   ├── leads.service.ts   # Leads related API calls
│   ├── users.service.ts   # Users related API calls
│   └── workspace.service.ts # Workspace related API calls
├── types/                 # Service-specific types (uses @eleads/shared)
│   └── api.types.ts
├── index.ts              # Main export file
└── README.md            # This file
```

## Usage

### Importing Services

Instead of importing the axios instance directly, import specific services:

```typescript
// ❌ Old way
import api from "@/services/httpConfig";
const response = await api.post("/users/login", credentials);

// ✅ New way
import { authService } from "@/services";
const response = await authService.login(credentials);
```

### Available Services

#### AuthService

```typescript
import { authService } from "@/services";

// Login
const response: SuccessResponse = await authService.login({ email, password });

// Register
const response: SuccessResponse = await authService.register(userData);

// Get current user
const response: SuccessResponse = await authService.getCurrentUser();

// Logout
await authService.logout();
```

#### LeadsService

```typescript
import { leadsService } from "@/services";

// Get all leads
const response: SuccessResponse = await leadsService.getLeads({ page: 1, limit: 10 });

// Create lead
const response: SuccessResponse = await leadsService.createLead(leadData);

// Update lead
const response: SuccessResponse = await leadsService.updateLead({ id, ...updates });

// Delete lead
const response: SuccessResponse = await leadsService.deleteLead(id);
```

#### UsersService

```typescript
import { usersService } from "@/services";

// Get workspace users
const response: SuccessResponse = await usersService.getUsers(workspaceId);

// Update user profile
const response: SuccessResponse = await usersService.updateUser(id, userData);

// Invite user
const response: SuccessResponse = await usersService.inviteUser(workspaceId, email, permissions);
```

#### WorkspaceService

```typescript
import { workspaceService } from "@/services";

// Get workspace
const response: SuccessResponse = await workspaceService.getWorkspace(id);

// Update workspace
const response: SuccessResponse = await workspaceService.updateWorkspace(id, workspaceData);

// Get workspace stats
const response: SuccessResponse = await workspaceService.getWorkspaceStats(id);
```

## Type Safety

All services are fully typed with TypeScript interfaces using shared types from `@eleads/shared`. All API responses return `Promise<SuccessResponse>` for consistency:

```typescript
import type { LoginRequest, SuccessResponse, Lead, LeadStatus, UserRole } from "@/services";

const loginData: LoginRequest = {
  email: "user@example.com",
  password: "password123",
};

const response: SuccessResponse = await authService.login(loginData);

// Using shared enums
const leadData = {
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  phone: ["+1234567890"],
  company: "Example Corp",
  status: LeadStatus.NEW,
  country: "USA",
  workspaceId: "workspace-id",
};
```

## Error Handling

The `httpConfig.ts` file includes global error handling with interceptors that:

- Handle authentication errors (401)
- Show toast notifications for server errors
- Log errors to console
- Propagate errors to calling code

## Benefits

1. **Separation of Concerns**: Each service handles its own domain
2. **Type Safety**: Full TypeScript support with proper interfaces
3. **Reusability**: Services can be easily reused across components
4. **Maintainability**: Changes to API endpoints are centralized
5. **Testing**: Easier to mock and test individual services
6. **Documentation**: Self-documenting API through service methods

## Shared Types

This service layer uses types from the `@eleads/shared` package for consistency across the application:

- **UserDTO**: User data structure
- **WorkspaceDTO**: Workspace data structure
- **LeadDTO**: Lead data structure
- **LeadStatus**: Enum for lead statuses (NEW, INPROGRESS, LOST)
- **UserRole**: Enum for user roles (USER, ADMIN, MANAGER)
- **Permission**: Enum for user permissions
- **SuccessResponse**: Standard API response structure

## Adding New Services

To add a new service:

1. Create a new service file in `api/` directory
2. Define request/response types in `types/api.types.ts` (using shared types where possible)
3. Export the service in `index.ts`
4. Update this README with usage examples
