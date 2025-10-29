import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ButtonIcon } from "@/components/ui/button-icon";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import AppDialog from "@/components/core/AppDialog";
import AppSelect from "@/components/core/AppSelect";
import InviteFriendDialog from "@/components/core/Settings/InviteFriendDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Edit, MoreHorizontal, Save, X, UserPlus } from "lucide-react";
import { useState } from "react";
import { consts, types } from "@eleads/shared";
import { useAuthStore } from "@/stores/authStore";
import ProtectedUI from "@/components/providers/ProtectedUI";
import { formatPermissionDisplay } from "@/utils/utilFunc";

export interface WorkspaceUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  avatarUrl: string;
  permissions: string[];
}

interface PermissionsTabProps {
  settingsWorkspaceUsers: WorkspaceUser[];
}

const PermissionsTab = ({ settingsWorkspaceUsers }: PermissionsTabProps) => {
  const [editingUser, setEditingUser] = useState<WorkspaceUser | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [selectedPermission, setSelectedPermission] = useState<string>("");
  const [currentPermissions, setCurrentPermissions] = useState<string[]>([]);
  const { isUserHasPermission } = useAuthStore();
  // Invite friend states
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

  const handleEditUser = (userId: string) => {
    const user = settingsWorkspaceUsers.find((u) => u.id === userId);
    if (user) {
      setEditingUser(user);
      setSelectedRole(user.role);
      setCurrentPermissions([...user.permissions]);
      setIsEditDialogOpen(true);
    }
  };

  const handleSaveUser = () => {
    // Handle save user functionality
    console.log("Save user:", editingUser);
    console.log("Selected role:", selectedRole);
    console.log("Selected permission:", selectedPermission);
    console.log("Updated permissions:", currentPermissions);
    setIsEditDialogOpen(false);
    setEditingUser(null);
    setSelectedRole("");
    setSelectedPermission("");
    setCurrentPermissions([]);
  };

  const handleAddPermission = (permission: string) => {
    if (permission && !currentPermissions.includes(permission)) {
      setCurrentPermissions([...currentPermissions, permission]);
      setSelectedPermission("");
    }
  };

  const handleRemovePermission = (permissionToRemove: string) => {
    setCurrentPermissions(currentPermissions.filter((p) => p !== permissionToRemove));
  };

  const handleInviteFriend = (data: { email: string; role: string; permissions: string[] }) => {
    // Handle invite friend functionality
    console.log("Invite friend:", data);
    setIsInviteDialogOpen(false);
  };

  const roleOptions = Object.entries(consts.roleOptions).map(([key, value]) => ({
    value: value,
    label: key.charAt(0) + key.slice(1).toLowerCase(),
  }));

  const permissionOptions = Object.entries(consts.permissionsOptions).map(([key, value]) => ({
    value: value,
    label: key
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase()),
    disabled: value === consts.permissionsOptions.MANAGE_OWN_LEADS,
  }));

  const getPermissionOptions = (currentPermissions: string[]) => {
    return permissionOptions.map((option) => ({
      ...option,
      disabled: option.disabled || currentPermissions.includes(option.value),
    }));
  };

  const renderPermissions = (permissions: string[]) => {
    const maxVisible = 1;
    const visiblePermissions = permissions.slice(0, maxVisible);
    const remainingCount = permissions.length - maxVisible;
    const remainingPermissions = permissions.slice(maxVisible);

    return (
      <div className="flex flex-wrap gap-1 items-center">
        {visiblePermissions.map((permission) => (
          <Badge key={permission} variant="outline" className="text-xs">
            {formatPermissionDisplay(permission)}
          </Badge>
        ))}
        {remainingCount > 0 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 cursor-pointer">
                  <MoreHorizontal className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">+{remainingCount} more</span>
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-popover text-popover-foreground border shadow-md">
                <div className="flex flex-wrap gap-1 max-w-xs">
                  {remainingPermissions.map((permission) => (
                    <Badge key={permission} variant="secondary" className="text-xs">
                      {formatPermissionDisplay(permission)}
                    </Badge>
                  ))}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    );
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Workspace Users</h3>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Permissions</TableHead>
              {isUserHasPermission([
                consts.permissionsOptions.MANAGE_USERS,
              ] as types.Permission[]) && <TableHead className="w-[50px]">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {settingsWorkspaceUsers.map((workspaceUser) => (
              <TableRow key={workspaceUser.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={workspaceUser.avatarUrl}
                        alt={`${workspaceUser.firstName} ${workspaceUser.lastName}`}
                      />
                      <AvatarFallback className="text-xs">
                        {workspaceUser.firstName[0]}
                        {workspaceUser.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">
                      {workspaceUser.firstName} {workspaceUser.lastName}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{workspaceUser.email}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{workspaceUser.role}</Badge>
                </TableCell>
                <TableCell>{renderPermissions(workspaceUser.permissions)}</TableCell>
                <TableCell>
                  <ProtectedUI
                    allowedPermissions={
                      [consts.permissionsOptions.MANAGE_USERS] as types.Permission[]
                    }
                  >
                    <ButtonIcon
                      onClick={() => handleEditUser(workspaceUser.id)}
                      icon={<Edit className="h-4 w-4" />}
                      className="h-8 w-8 text-muted-foreground hover:text-foreground transition-colors"
                    />
                  </ProtectedUI>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <ProtectedUI
        allowedPermissions={[consts.permissionsOptions.MANAGE_USERS] as types.Permission[]}
      >
        <div className="flex justify-end mt-4">
          <Button onClick={() => setIsInviteDialogOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Friend
          </Button>
        </div>
      </ProtectedUI>

      {/* Edit User Dialog */}
      <ProtectedUI
        allowedPermissions={[consts.permissionsOptions.MANAGE_USERS] as types.Permission[]}
      >
        <AppDialog
          trigger={<div style={{ display: "none" }} />}
          title="Edit User Permissions"
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          footer={
            <>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveUser}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </>
          }
        >
          {editingUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={editingUser.avatarUrl}
                    alt={`${editingUser.firstName} ${editingUser.lastName}`}
                  />
                  <AvatarFallback>
                    {editingUser.firstName[0]}
                    {editingUser.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">
                    {editingUser.firstName} {editingUser.lastName}
                  </h4>
                  <p className="text-sm text-muted-foreground">{editingUser.email}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <AppSelect
                  placeholder="Select role"
                  value={selectedRole}
                  onValueChange={setSelectedRole}
                  options={roleOptions}
                  triggerClassName="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>Current Permissions</Label>
                <div className="flex flex-wrap gap-1">
                  {currentPermissions.map((permission) => (
                    <div key={permission} className="flex items-center gap-1">
                      <Badge variant="outline" className="text-xs">
                        {formatPermissionDisplay(permission)}
                      </Badge>
                      <ButtonIcon
                        onClick={() => handleRemovePermission(permission)}
                        icon={<X className="h-3 w-3" />}
                        className="h-5 w-5 text-muted-foreground hover:text-destructive transition-colors"
                      />
                    </div>
                  ))}
                  {currentPermissions.length === 0 && (
                    <p className="text-sm text-muted-foreground">No permissions assigned</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="permissions">Add Permissions</Label>
                <AppSelect
                  placeholder="Select permissions to add"
                  value={selectedPermission}
                  onValueChange={(value) => {
                    setSelectedPermission(value);
                    if (value) {
                      handleAddPermission(value);
                    }
                  }}
                  options={getPermissionOptions(currentPermissions)}
                  triggerClassName="w-full"
                />
              </div>
            </div>
          )}
        </AppDialog>
      </ProtectedUI>

      {/* Invite Friend Dialog */}
      <ProtectedUI
        allowedPermissions={[consts.permissionsOptions.MANAGE_USERS] as types.Permission[]}
      >
        <InviteFriendDialog
          open={isInviteDialogOpen}
          onOpenChange={setIsInviteDialogOpen}
          onInvite={handleInviteFriend}
        />
      </ProtectedUI>
    </div>
  );
};

export default PermissionsTab;
