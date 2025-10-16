import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Camera, User, Shield, Bell, Palette, Mail } from "lucide-react";
import {
  AccountTab,
  PermissionsTab,
  NotificationsTab,
  PreferenceTab,
} from "@/components/core/Settings";
import type { WorkspaceUser } from "@/components/core/Settings/PermissionsTab";
import { useAuthStore } from "@/stores/authStore";
import { types } from "@eleads/shared";
import { workspaceService } from "@/services/api/workspace.service";

const mockWorkspaceUsers = [
  {
    id: "user-123",
    email: "john.doe@company.com",
    firstName: "John",
    lastName: "Doe",
    role: "ADMIN",
    avatarUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    permissions: ["read:users", "write:users", "admin:workspace"],
  },
  {
    id: "user-124",
    email: "jane.smith@company.com",
    firstName: "Jane",
    lastName: "Smith",
    role: "USER",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    permissions: ["read:users"],
  },
  {
    id: "user-125",
    email: "mike.wilson@company.com",
    firstName: "Mike",
    lastName: "Wilson",
    role: "MANAGER",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    permissions: ["read:users", "write:users"],
  },
];

const TestPage = () => {
  const { user, setUser } = useAuthStore();
  const [settingsWorkspaceUsers, setSettingsWorkspaceUsers] = useState<WorkspaceUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);

  // Fetch workspace users on component mount
  useEffect(() => {
    const fetchWorkspaceUsers = async () => {
      try {
        setIsLoadingUsers(true);
        const response = await workspaceService.getWorkspaceUsers();
        if (response.success && response.data) {
          // Transform the data to match our interface
          const transformedUsers = response.data.map((user: types.UserDTO) => ({
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            avatarUrl:
              user.avatarUrl ||
              `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}`,
            permissions: user.permissions || [],
          }));
          setSettingsWorkspaceUsers(transformedUsers);
        }
      } catch (error) {
        console.error("Failed to fetch workspace users:", error);
        // Fallback to mock data if API fails
        setSettingsWorkspaceUsers(mockWorkspaceUsers);
      } finally {
        setIsLoadingUsers(false);
      }
    };

    fetchWorkspaceUsers();
  }, []);

  return (
    <div className="max-h-screen h-[calc(100vh-28px)] bg-gradient-subtle p-6">
      <div className="max-w-7xl h-full mx-auto space-y-6">
        {/* Upper Card - Current User Info */}
        <Card className="shadow-elegant border-border/50 h-[25%]">
          <CardContent className="p-6 h-full">
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="h-20 w-20 border-4 border-primary/20">
                  <AvatarImage
                    src={`https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}`}
                    alt={`${user?.firstName} ${user?.lastName}`}
                  />
                  <AvatarFallback className="text-lg bg-gradient-primary text-primary-foreground">
                    {user?.firstName[0]}
                    {user?.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 shadow-glow"
                  variant="default"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold">
                    {user?.firstName} {user?.lastName}
                  </h2>
                  <Badge variant="secondary">{user?.role}</Badge>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Mail className="h-4 w-4" />
                  <span>{user?.email}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Member Since:</span>
                    <p className="font-medium">
                      {new Date(user?.createdAt || "").toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Last Update:</span>
                    <p className="font-medium">
                      {new Date(user?.updatedAt || "").toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lower Card - Tabbed Settings */}
        <Card className="shadow-elegant border-border/50 overflow-hidden h-[72%]">
          <Tabs defaultValue="account" className="w-full h-full">
            <div className="px-6 pt-6">
              <TabsList className="grid w-full grid-cols-4 bg-muted/50">
                <TabsTrigger value="account" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Account
                </TabsTrigger>
                <TabsTrigger value="permissions" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Permissions
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="preference" className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Preference
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Account Tab */}
            <TabsContent
              value="account"
              className="px-6 pb-6 space-y-6 h-[calc(100%-120px)] overflow-y-auto"
            >
              <AccountTab
                user={user as types.UserDTO}
                setUser={setUser}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            </TabsContent>

            {/* Permissions Tab */}
            <TabsContent
              value="permissions"
              className="px-6 pb-6 space-y-6 h-[calc(100%-120px)] overflow-y-auto"
            >
              {isLoadingUsers ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading workspace users...</p>
                  </div>
                </div>
              ) : (
                <PermissionsTab
                  settingsWorkspaceUsers={settingsWorkspaceUsers as WorkspaceUser[]}
                />
              )}
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent
              value="notifications"
              className="px-6 pb-6 space-y-6 h-[calc(100%-120px)] overflow-y-auto"
            >
              <NotificationsTab />
            </TabsContent>

            {/* Preference Tab */}
            <TabsContent
              value="preference"
              className="px-6 pb-6 space-y-6 h-[calc(100%-120px)] overflow-y-auto"
            >
              <PreferenceTab />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default TestPage;
