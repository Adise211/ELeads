import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { FeatureBadges } from "../FeatureBadges";
import { FEATURE_FLAGS_OPTIONS } from "@/utils/localConsts";
import type { FeatureBadgeType } from "@/utils/localTypes";

const PreferenceTab = () => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Application Preferences</h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <Input id="language" value="English (US)" disabled className="transition-smooth" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="timezone">Timezone</Label>
          <Input
            id="timezone"
            value="UTC-05:00 (Eastern Standard Time)"
            disabled
            className="transition-smooth"
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <FeatureBadges type={FEATURE_FLAGS_OPTIONS.SOON as FeatureBadgeType}>
              <p className="font-medium">Dark Mode</p>
            </FeatureBadges>
            <p className="text-sm text-muted-foreground">Switch between light and dark themes</p>
          </div>
          <Switch disabled={true} />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <FeatureBadges type={FEATURE_FLAGS_OPTIONS.SOON as FeatureBadgeType}>
              <p className="font-medium">Compact View</p>
            </FeatureBadges>
            <p className="text-sm text-muted-foreground">Use a more compact layout</p>
          </div>
          <Switch disabled={true} />
        </div>
      </div>
    </div>
  );
};

export default PreferenceTab;
