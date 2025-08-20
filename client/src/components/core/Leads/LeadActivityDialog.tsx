import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { types } from "@eleads/shared";

interface LeadActivityDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  activity: types.ActivityDTO | null;
  activityType: types.ActivityType;
  activityDescription: string;
  onActivityTypeChange: (type: types.ActivityType) => void;
  onActivityDescriptionChange: (description: string) => void;
  onSave: () => void;
  isLoading?: boolean;
}

const LeadActivityDialog = ({
  isOpen,
  onOpenChange,
  activityType,
  activityDescription,
  onActivityTypeChange,
  onActivityDescriptionChange,
  onSave,
  isLoading = false,
}: LeadActivityDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Activity</DialogTitle>
          <DialogDescription>Update the activity details below.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="editActivityType">Activity Type</Label>
            <Select
              value={activityType}
              onValueChange={(value) => onActivityTypeChange(value as types.ActivityType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select activity type" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(types.ActivityType).map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="editActivityDescription">Description</Label>
            <Textarea
              id="editActivityDescription"
              placeholder="Enter activity description..."
              value={activityDescription}
              onChange={(e) => onActivityDescriptionChange(e.target.value)}
              className="min-h-[120px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={onSave} disabled={!activityDescription.trim() || isLoading}>
            {isLoading ? "Updating..." : "Update Activity"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LeadActivityDialog;
