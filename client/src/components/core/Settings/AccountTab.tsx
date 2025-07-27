import { Button } from "@/components/ui/button";
import { ButtonIcon } from "@/components/ui/button-icon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AppDialog from "@/components/core/AppDialog";
import { Mail, Phone, Lock, Save, Edit, Check } from "lucide-react";
import { showSuccessToast } from "@/utils/toast";
import type { UserDTO } from "../../../../../shared/types/index";
import { useState } from "react";

interface AccountTabProps {
  user: UserDTO;
  setUser: (user: UserDTO) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const AccountTab = ({ user, setUser, isLoading, setIsLoading }: AccountTabProps) => {
  const [editingFields, setEditingFields] = useState<Record<string, boolean>>({});
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

  const toggleFieldEdit = (fieldName: string) => {
    setEditingFields((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
  };

  const handleFieldSave = (fieldName: string) => {
    // Here you would typically save the field to the backend
    setEditingFields((prev) => ({
      ...prev,
      [fieldName]: false,
    }));
    showSuccessToast(`${fieldName} has been updated.`);
  };

  const handlePasswordChange = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsPasswordDialogOpen(false);
      showSuccessToast("Your password has been successfully changed.");
    }, 1000);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Account Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <div className="relative">
            <Input
              id="firstName"
              value={user.firstName}
              onChange={(e) => setUser({ ...user, firstName: e.target.value })}
              className="transition-smooth focus:shadow-glow pr-10"
              disabled={!editingFields.firstName}
            />
            <ButtonIcon
              onClick={() =>
                editingFields.firstName
                  ? handleFieldSave("firstName")
                  : toggleFieldEdit("firstName")
              }
              icon={
                editingFields.firstName ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Edit className="h-4 w-4" />
                )
              }
              className="absolute top-1/2 right-3 transform -translate-y-1/2 h-6 w-6 text-muted-foreground hover:text-foreground transition-colors"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <div className="relative">
            <Input
              id="lastName"
              value={user.lastName}
              onChange={(e) => setUser({ ...user, lastName: e.target.value })}
              className="transition-smooth focus:shadow-glow pr-10"
              disabled={!editingFields.lastName}
            />
            <ButtonIcon
              onClick={() =>
                editingFields.lastName ? handleFieldSave("lastName") : toggleFieldEdit("lastName")
              }
              icon={
                editingFields.lastName ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Edit className="h-4 w-4" />
                )
              }
              className="absolute top-1/2 right-3 transform -translate-y-1/2 h-6 w-6 text-muted-foreground hover:text-foreground transition-colors"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email
          </Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className="transition-smooth focus:shadow-glow pr-10"
              disabled={!editingFields.email}
            />
            <ButtonIcon
              onClick={() =>
                editingFields.email ? handleFieldSave("email") : toggleFieldEdit("email")
              }
              icon={
                editingFields.email ? <Check className="h-4 w-4" /> : <Edit className="h-4 w-4" />
              }
              className="absolute top-1/2 right-3 transform -translate-y-1/2 h-6 w-6 text-muted-foreground hover:text-foreground transition-colors"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Phone
          </Label>
          <div className="relative">
            <Input
              id="phone"
              value={user.phone || ""}
              onChange={(e) => setUser({ ...user, phone: e.target.value })}
              className="transition-smooth focus:shadow-glow pr-10"
              disabled={!editingFields.phone}
            />
            <ButtonIcon
              onClick={() =>
                editingFields.phone ? handleFieldSave("phone") : toggleFieldEdit("phone")
              }
              icon={
                editingFields.phone ? <Check className="h-4 w-4" /> : <Edit className="h-4 w-4" />
              }
              className="absolute top-1/2 right-3 transform -translate-y-1/2 h-6 w-6 text-muted-foreground hover:text-foreground transition-colors"
            />
          </div>
        </div>
        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Password
          </Label>
          <div className="relative flex items-center gap-2">
            <Input
              id="password"
              value={"123456789"}
              className="transition-smooth focus:shadow-glow pr-10"
              disabled={!editingFields.password}
              type="password"
            />
            <AppDialog
              trigger={<Button variant="outline">Change Password</Button>}
              title="Change Password"
              open={isPasswordDialogOpen}
              onOpenChange={setIsPasswordDialogOpen}
              footer={
                <>
                  <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handlePasswordChange} disabled={isLoading}>
                    <Save className="h-4 w-4 mr-2" />
                    {isLoading ? "Changing..." : "Change Password"}
                  </Button>
                </>
              }
            >
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  className="transition-smooth focus:shadow-glow"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  className="transition-smooth focus:shadow-glow"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  className="transition-smooth focus:shadow-glow"
                />
              </div>
            </AppDialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountTab;
