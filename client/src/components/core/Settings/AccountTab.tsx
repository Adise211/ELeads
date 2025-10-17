import { Button } from "@/components/ui/button";
import { ButtonIcon } from "@/components/ui/button-icon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AppDialog from "@/components/core/AppDialog";
import { Mail, Phone, Lock, Save, Edit, Check, X } from "lucide-react";
import { showSuccessToast, showErrorToast } from "@/utils/toast";
import { types } from "@eleads/shared";
import { useState, useEffect } from "react";
import { authService } from "@/services/api/auth.service";
import { formatToTitleCase } from "@/utils/utilFunc";

interface AccountTabProps {
  user: types.UserDTO;
  setUser: (user: types.UserDTO) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const AccountTab = ({ user, setUser, isLoading, setIsLoading }: AccountTabProps) => {
  const [editingFields, setEditingFields] = useState<Record<string, boolean>>({});
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [originalValues, setOriginalValues] = useState<Record<string, string>>({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone || "",
  });
  const [tempValues, setTempValues] = useState<Record<string, string>>({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone || "",
  });

  // Sync tempValues with user prop when user changes
  useEffect(() => {
    setTempValues({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || "",
    });
    setOriginalValues({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || "",
    });
  }, [user]);

  const toggleFieldEdit = (fieldName: string) => {
    if (!editingFields[fieldName]) {
      // Starting to edit - store the current value as original
      setOriginalValues((prev) => ({
        ...prev,
        [fieldName]: String(user[fieldName as keyof typeof user] || ""),
      }));
    }
    setEditingFields((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
  };

  const handleFieldSave = async (fieldName: string) => {
    try {
      setIsLoading(true);

      // Prepare the user data for the API call using current temp values
      const userData = {
        firstName: tempValues.firstName,
        lastName: tempValues.lastName,
        email: tempValues.email,
        phone: tempValues.phone || undefined,
      };

      const response = await authService.updateUserInfo(userData);

      if (response.success && response.data) {
        // Update the store only after successful API response
        setUser(response.data as types.UserDTO);

        // Update original values to current values
        setOriginalValues((prev) => ({
          ...prev,
          [fieldName]: tempValues[fieldName],
        }));

        setEditingFields((prev) => ({
          ...prev,
          [fieldName]: false,
        }));
        showSuccessToast(`${formatToTitleCase(fieldName)} has been updated.`);
      }
    } catch (error: unknown) {
      console.error("Update user info error:", error);

      // Revert the temp values to original values on error
      setTempValues((prev) => ({
        ...prev,
        [fieldName]: originalValues[fieldName],
      }));

      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to update user information. Please try again.";
      showErrorToast(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFieldCancel = (fieldName: string) => {
    // Restore the temp value to original value
    setTempValues((prev) => ({
      ...prev,
      [fieldName]: originalValues[fieldName],
    }));
    setEditingFields((prev) => ({
      ...prev,
      [fieldName]: false,
    }));
  };

  const resetPasswordForm = () => {
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handlePasswordChange = async () => {
    // Validation
    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      showErrorToast("Please fill in all password fields.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showErrorToast("New password and confirm password do not match.");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      showErrorToast("New password must be at least 8 characters long.");
      return;
    }

    if (passwordForm.currentPassword === passwordForm.newPassword) {
      showErrorToast("New password must be different from current password.");
      return;
    }

    try {
      setIsLoading(true);
      await authService.changePassword(passwordForm.currentPassword, passwordForm.newPassword);

      // Reset form and close dialog
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsPasswordDialogOpen(false);
      showSuccessToast("Your password has been successfully changed.");
    } catch (error: unknown) {
      console.error("Password change error:", error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to change password. Please try again.";
      showErrorToast(errorMessage);
    } finally {
      setIsLoading(false);
    }
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
              value={tempValues.firstName}
              onChange={(e) => setTempValues((prev) => ({ ...prev, firstName: e.target.value }))}
              className="transition-smooth focus:shadow-glow pr-10"
              disabled={!editingFields.firstName}
            />
            <div className="absolute top-1/2 right-3 transform -translate-y-1/2 flex items-center gap-1">
              {editingFields.firstName ? (
                <>
                  <ButtonIcon
                    onClick={() => handleFieldSave("firstName")}
                    icon={<Check className="h-4 w-4" />}
                    className="h-6 w-6 text-green-600 hover:text-green-700 transition-colors"
                    disabled={isLoading}
                  />
                  <ButtonIcon
                    onClick={() => handleFieldCancel("firstName")}
                    icon={<X className="h-4 w-4" />}
                    className="h-6 w-6 text-red-600 hover:text-red-700 transition-colors"
                  />
                </>
              ) : (
                <ButtonIcon
                  onClick={() => toggleFieldEdit("firstName")}
                  icon={<Edit className="h-4 w-4" />}
                  className="h-6 w-6 text-muted-foreground hover:text-foreground transition-colors"
                />
              )}
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <div className="relative">
            <Input
              id="lastName"
              value={tempValues.lastName}
              onChange={(e) => setTempValues((prev) => ({ ...prev, lastName: e.target.value }))}
              className="transition-smooth focus:shadow-glow pr-10"
              disabled={!editingFields.lastName}
            />
            <div className="absolute top-1/2 right-3 transform -translate-y-1/2 flex items-center gap-1">
              {editingFields.lastName ? (
                <>
                  <ButtonIcon
                    onClick={() => handleFieldSave("lastName")}
                    icon={<Check className="h-4 w-4" />}
                    className="h-6 w-6 text-green-600 hover:text-green-700 transition-colors"
                    disabled={isLoading}
                  />
                  <ButtonIcon
                    onClick={() => handleFieldCancel("lastName")}
                    icon={<X className="h-4 w-4" />}
                    className="h-6 w-6 text-red-600 hover:text-red-700 transition-colors"
                  />
                </>
              ) : (
                <ButtonIcon
                  onClick={() => toggleFieldEdit("lastName")}
                  icon={<Edit className="h-4 w-4" />}
                  className="h-6 w-6 text-muted-foreground hover:text-foreground transition-colors"
                />
              )}
            </div>
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
              value={tempValues.email}
              onChange={(e) => setTempValues((prev) => ({ ...prev, email: e.target.value }))}
              className="transition-smooth focus:shadow-glow pr-10"
              disabled={!editingFields.email}
            />
            <div className="absolute top-1/2 right-3 transform -translate-y-1/2 flex items-center gap-1">
              {editingFields.email ? (
                <>
                  <ButtonIcon
                    onClick={() => handleFieldSave("email")}
                    icon={<Check className="h-4 w-4" />}
                    className="h-6 w-6 text-green-600 hover:text-green-700 transition-colors"
                    disabled={isLoading}
                  />
                  <ButtonIcon
                    onClick={() => handleFieldCancel("email")}
                    icon={<X className="h-4 w-4" />}
                    className="h-6 w-6 text-red-600 hover:text-red-700 transition-colors"
                  />
                </>
              ) : (
                <ButtonIcon
                  onClick={() => toggleFieldEdit("email")}
                  icon={<Edit className="h-4 w-4" />}
                  className="h-6 w-6 text-muted-foreground hover:text-foreground transition-colors"
                />
              )}
            </div>
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
              value={tempValues.phone}
              onChange={(e) => setTempValues((prev) => ({ ...prev, phone: e.target.value }))}
              className="transition-smooth focus:shadow-glow pr-10"
              disabled={!editingFields.phone}
            />
            <div className="absolute top-1/2 right-3 transform -translate-y-1/2 flex items-center gap-1">
              {editingFields.phone ? (
                <>
                  <ButtonIcon
                    onClick={() => handleFieldSave("phone")}
                    icon={<Check className="h-4 w-4" />}
                    className="h-6 w-6 text-green-600 hover:text-green-700 transition-colors"
                    disabled={isLoading}
                  />
                  <ButtonIcon
                    onClick={() => handleFieldCancel("phone")}
                    icon={<X className="h-4 w-4" />}
                    className="h-6 w-6 text-red-600 hover:text-red-700 transition-colors"
                  />
                </>
              ) : (
                <ButtonIcon
                  onClick={() => toggleFieldEdit("phone")}
                  icon={<Edit className="h-4 w-4" />}
                  className="h-6 w-6 text-muted-foreground hover:text-foreground transition-colors"
                />
              )}
            </div>
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
              onOpenChange={(open) => {
                setIsPasswordDialogOpen(open);
                if (!open) {
                  resetPasswordForm();
                }
              }}
              footer={
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsPasswordDialogOpen(false);
                      resetPasswordForm();
                    }}
                  >
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
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))
                  }
                  className="transition-smooth focus:shadow-glow"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))
                  }
                  className="transition-smooth focus:shadow-glow"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))
                  }
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
