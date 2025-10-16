import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { NewBadge, SoonBadge } from "@/components/core/featureBadges";
import { useGeneralStore } from "@/stores/generalStore";

const PreferenceTab = () => {
  const soonFeatures = useGeneralStore((state) => state.soonFeatures);
  const newFeatures = useGeneralStore((state) => state.newFeatures);

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
            <div className="flex items-center gap-2">
              <p className={`font-medium ${soonFeatures.darkMode ? "text-gray-500" : ""}`}>
                Dark Mode
              </p>
              {soonFeatures.darkMode && <SoonBadge />}
              {newFeatures.darkMode && <NewBadge />}
            </div>
            <p className="text-sm text-muted-foreground">Switch between light and dark themes</p>
          </div>
          <Switch disabled={soonFeatures.darkMode} />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <p className={`font-medium ${soonFeatures.compactView ? "text-gray-500" : ""}`}>
                Compact View
              </p>
              {soonFeatures.compactView && <SoonBadge />}
              {newFeatures.compactView && <NewBadge />}
            </div>
            <p className="text-sm text-muted-foreground">Use a more compact layout</p>
          </div>
          <Switch disabled={soonFeatures.compactView} />
        </div>
      </div>
    </div>
  );
};

export default PreferenceTab;
