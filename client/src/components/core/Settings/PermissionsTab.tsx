import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface WorkspaceUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  avatarUrl: string;
  permissions: string[];
}

interface PermissionsTabProps {
  workspaceUsers: WorkspaceUser[];
}

const PermissionsTab = ({ workspaceUsers }: PermissionsTabProps) => {
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {workspaceUsers.map((workspaceUser) => (
              <TableRow key={workspaceUser.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={workspaceUser.avatarUrl}
                        alt={`${workspaceUser.firstName} ${workspaceUser.lastName}`}
                      />
                      <AvatarFallback className="text-xs bg-gradient-primary text-primary-foreground">
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
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {workspaceUser.permissions.map((permission) => (
                      <Badge key={permission} variant="outline" className="text-xs">
                        {permission}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PermissionsTab;
