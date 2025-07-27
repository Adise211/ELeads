import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, Lock, Save } from "lucide-react";
import { showSuccessToast } from "@/utils/toast";
import type { UserDTO } from "../../../../../shared/types/index";

interface AccountTabProps {
  user: UserDTO;
  setUser: (user: UserDTO) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const AccountTab = ({ user, setUser, isLoading, setIsLoading }: AccountTabProps) => {
  const handleSaveProfile = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      showSuccessToast("Your profile has been successfully updated.");
    }, 1000);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Account Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={user.firstName}
            onChange={(e) => setUser({ ...user, firstName: e.target.value })}
            className="transition-smooth focus:shadow-glow"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={user.lastName}
            onChange={(e) => setUser({ ...user, lastName: e.target.value })}
            className="transition-smooth focus:shadow-glow"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            className="transition-smooth focus:shadow-glow"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Phone
          </Label>
          <Input
            id="phone"
            value={user.phone || ""}
            onChange={(e) => setUser({ ...user, phone: e.target.value })}
            className="transition-smooth focus:shadow-glow"
          />
        </div>
      </div>

      <Separator className="my-6" />

      <div className="space-y-4">
        <h4 className="font-medium flex items-center gap-2">
          <Lock className="h-4 w-4" />
          Change Password
        </h4>
        <div className="grid gap-4">
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
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button
          onClick={handleSaveProfile}
          disabled={isLoading}
          className="bg-gradient-primary shadow-glow hover:shadow-elegant transition-smooth"
        >
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};

export default AccountTab;
