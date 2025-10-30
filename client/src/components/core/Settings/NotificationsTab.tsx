import { Switch } from "@/components/ui/switch";
// import FeatureBadge from "@/components/core/FeatureBadges/FeatureBadge.tsx";
// import { FEATURE_FLAGS_OPTIONS } from "@/utils/localConsts";
// import type { FeatureBadgeType } from "@/utils/localTypes";

const NotificationsTab = () => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          {/* Email Notifications */}
          <div>
            {/* <FeatureBadge type={FEATURE_FLAGS_OPTIONS.SOON as FeatureBadgeType}> */}
            <p className="font-medium">Email Notifications</p>
            {/* </FeatureBadge> */}
            <p className="text-sm text-muted-foreground">Receive notifications via email</p>
          </div>
          <Switch defaultChecked disabled={true} />
        </div>
        <div className="flex items-center justify-between">
          {/* Lead Updates */}
          <div>
            {/* <FeatureBadge type={FEATURE_FLAGS_OPTIONS.SOON as FeatureBadgeType}> */}
            <p className="font-medium">Lead Updates</p>
            {/* </FeatureBadge> */}
            <p className="text-sm text-muted-foreground">Get notified when leads are updated</p>
          </div>
          <Switch defaultChecked disabled={true} />
        </div>
        {/* Activity Reminders */}
        <div className="flex items-center justify-between">
          <div>
            {/* <FeatureBadge type={FEATURE_FLAGS_OPTIONS.SOON as FeatureBadgeType}> */}
            <p className="font-medium">Activity Reminders</p>
            {/* </FeatureBadge> */}
            <p className="text-sm text-muted-foreground">
              Receive reminders for scheduled activities
            </p>
          </div>
          <Switch defaultChecked disabled={true} />
        </div>
        {/* Workspace Changes */}
        <div className="flex items-center justify-between">
          <div>
            {/* <FeatureBadge type={FEATURE_FLAGS_OPTIONS.SOON as FeatureBadgeType}> */}
            <p className="font-medium">Workspace Changes</p>
            {/* </FeatureBadge> */}
            <p className="text-sm text-muted-foreground">Get notified about workspace updates</p>
          </div>
          <Switch defaultChecked disabled={true} />
        </div>
      </div>
    </div>
  );
};

export default NotificationsTab;
