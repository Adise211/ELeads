import { Badge } from "@/components/ui/badge";
import { ButtonIcon } from "@/components/ui/button-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AppDialog from "@/components/core/AppDialog";
import AppSelect from "@/components/core/AppSelect";
import { Mail, X } from "lucide-react";
import { useState } from "react";
import { consts } from "@eleads/shared";
import { formatPermissionDisplay } from "@/utils/utilFunc";

interface InviteFriendDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInvite: (data: { email: string; role: string; permissions: string[] }) => void;
}

const InviteFriendDialog = ({ open, onOpenChange, onInvite }: InviteFriendDialogProps) => {
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("");
  const [invitePermissions, setInvitePermissions] = useState<string[]>([]);
  const [selectedInvitePermission, setSelectedInvitePermission] = useState("");

  const handleInviteFriend = () => {
    onInvite({
      email: inviteEmail,
      role: inviteRole,
      permissions: invitePermissions,
    });
    // Reset form
    setInviteEmail("");
    setInviteRole("");
    setInvitePermissions([]);
    setSelectedInvitePermission("");
  };

  const handleAddInvitePermission = (permission: string) => {
    if (permission && !invitePermissions.includes(permission)) {
      setInvitePermissions([...invitePermissions, permission]);
      setSelectedInvitePermission("");
    }
  };

  const handleRemoveInvitePermission = (permissionToRemove: string) => {
    setInvitePermissions(invitePermissions.filter((p) => p !== permissionToRemove));
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

  return (
    <AppDialog
      trigger={<div style={{ display: "none" }} />}
      title="Invite Friend"
      description="Send an invitation to join your workspace"
      open={open}
      onOpenChange={onOpenChange}
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleInviteFriend} disabled={!inviteEmail || !inviteRole}>
            <Mail className="h-4 w-4 mr-2" />
            Send Invitation
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="invite-email">Email Address</Label>
          <Input
            id="invite-email"
            type="email"
            placeholder="friend@example.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className="transition-smooth focus:shadow-glow"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="invite-role">Role</Label>
          <AppSelect
            placeholder="Select role"
            value={inviteRole}
            onValueChange={setInviteRole}
            options={roleOptions}
            triggerClassName="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label>Initial Permissions</Label>
          <div className="flex flex-wrap gap-1">
            {invitePermissions.map((permission) => (
              <div key={permission} className="flex items-center gap-1">
                <Badge variant="outline" className="text-xs">
                  {formatPermissionDisplay(permission)}
                </Badge>
                <ButtonIcon
                  onClick={() => handleRemoveInvitePermission(permission)}
                  icon={<X className="h-3 w-3" />}
                  className="h-5 w-5 text-muted-foreground hover:text-destructive transition-colors"
                />
              </div>
            ))}
            {invitePermissions.length === 0 && (
              <p className="text-sm text-muted-foreground">No permissions assigned</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="invite-permissions">Add Permissions</Label>
          <AppSelect
            placeholder="Select permissions to add"
            value={selectedInvitePermission}
            onValueChange={(value) => {
              setSelectedInvitePermission(value);
              if (value) {
                handleAddInvitePermission(value);
              }
            }}
            options={getPermissionOptions(invitePermissions)}
            triggerClassName="w-full"
          />
        </div>
      </div>
    </AppDialog>
  );
};

export default InviteFriendDialog;
