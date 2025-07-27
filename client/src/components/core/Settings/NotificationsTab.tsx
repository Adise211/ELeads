import { Switch } from "@/components/ui/switch";

const NotificationsTab = () => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Email Notifications</p>
            <p className="text-sm text-muted-foreground">Receive notifications via email</p>
          </div>
          <Switch defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Lead Updates</p>
            <p className="text-sm text-muted-foreground">Get notified when leads are updated</p>
          </div>
          <Switch defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Activity Reminders</p>
            <p className="text-sm text-muted-foreground">
              Receive reminders for scheduled activities
            </p>
          </div>
          <Switch defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Workspace Changes</p>
            <p className="text-sm text-muted-foreground">Get notified about workspace updates</p>
          </div>
          <Switch />
        </div>
      </div>
    </div>
  );
};

export default NotificationsTab;
