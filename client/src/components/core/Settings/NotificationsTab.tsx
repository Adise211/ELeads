import { Switch } from "@/components/ui/switch";
import { useGeneralStore } from "@/stores/generalStore";
import { SoonBadge } from "../featureBadges";

const NotificationsTab = () => {
  const soonFeatures = useGeneralStore((state) => state.soonFeatures);
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          {/* Email Notifications */}
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium">Email Notifications</p>
              {soonFeatures.emailNotifications && <SoonBadge />}
            </div>
            <p className="text-sm text-muted-foreground">Receive notifications via email</p>
          </div>
          <Switch defaultChecked disabled={soonFeatures.emailNotifications} />
        </div>
        <div className="flex items-center justify-between">
          {/* Lead Updates */}
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium">Lead Updates</p>
              {soonFeatures.leadUpdatesNotifications && <SoonBadge />}
            </div>
            <p className="text-sm text-muted-foreground">Get notified when leads are updated</p>
          </div>
          <Switch defaultChecked disabled={soonFeatures.leadUpdatesNotifications} />
        </div>
        {/* Activity Reminders */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium">Activity Reminders</p>
              {soonFeatures.activityRemindersNotifications && <SoonBadge />}
            </div>
            <p className="text-sm text-muted-foreground">
              Receive reminders for scheduled activities
            </p>
          </div>
          <Switch defaultChecked disabled={soonFeatures.activityRemindersNotifications} />
        </div>
        {/* Workspace Changes */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium">Workspace Changes</p>
              {soonFeatures.workspaceChangesNotifications && <SoonBadge />}
            </div>
            <p className="text-sm text-muted-foreground">Get notified about workspace updates</p>
          </div>
          <Switch defaultChecked disabled={soonFeatures.workspaceChangesNotifications} />
        </div>
      </div>
    </div>
  );
};

export default NotificationsTab;
