import { Button } from "@/components/ui/button";
import { Users, User } from "lucide-react";

interface DataViewToggleProps {
  isPersonalView: boolean;
  onToggle: (isPersonalView: boolean) => void;
}

const DataViewToggle = ({ isPersonalView, onToggle }: DataViewToggleProps) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant={!isPersonalView ? "default" : "outline"}
        size="sm"
        onClick={() => onToggle(false)}
        className="flex items-center gap-2"
      >
        <Users className="w-4 h-4" />
        Workspace
      </Button>
      <Button
        variant={isPersonalView ? "default" : "outline"}
        size="sm"
        onClick={() => onToggle(true)}
        className="flex items-center gap-2"
      >
        <User className="w-4 h-4" />
        Personal
      </Button>
    </div>
  );
};

export default DataViewToggle;
