import { Switch } from "@/components/ui/switch";
import FeatureBadge from "@/components/core/FeatBadges/FeatureBadge";
import { consts, types } from "@eleads/shared";

const NotificationsTab = () => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          {/* Email Notifications */}
          <div>
            <FeatureBadge type={consts.featureFlagTextOptions.SOON as types.FeatureBadgeType}>
              <p className="font-medium text-gray-500">Email Notifications</p>
            </FeatureBadge>
            <p className="text-sm text-muted-foreground">Receive notifications via email</p>
          </div>
          <Switch defaultChecked disabled={true} />
        </div>
        <div className="flex items-center justify-between">
          {/* Lead Updates */}
          <div>
            <FeatureBadge type={consts.featureFlagTextOptions.SOON as types.FeatureBadgeType}>
              <p className="font-medium text-gray-500">Lead Updates</p>
            </FeatureBadge>
            <p className="text-sm text-muted-foreground">Get notified when leads are updated</p>
          </div>
          <Switch defaultChecked disabled={true} />
        </div>
        {/* Activity Reminders */}
        <div className="flex items-center justify-between">
          <div>
            <FeatureBadge type={consts.featureFlagTextOptions.SOON as types.FeatureBadgeType}>
              <p className="font-medium text-gray-500">Activity Reminders</p>
            </FeatureBadge>
            <p className="text-sm text-muted-foreground">
              Receive reminders for scheduled activities
            </p>
          </div>
          <Switch defaultChecked disabled={true} />
        </div>
        {/* Workspace Changes */}
        <div className="flex items-center justify-between">
          <div>
            <FeatureBadge type={consts.featureFlagTextOptions.SOON as types.FeatureBadgeType}>
              <p className="font-medium text-gray-500">Workspace Changes</p>
            </FeatureBadge>
            <p className="text-sm text-muted-foreground">Get notified about workspace updates</p>
          </div>
          <Switch defaultChecked disabled={true} />
        </div>
      </div>
    </div>
  );
};

export default NotificationsTab;
