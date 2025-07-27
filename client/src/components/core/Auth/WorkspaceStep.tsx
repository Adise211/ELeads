import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Building2, Plus, Users, ArrowLeft } from "lucide-react";

interface WorkspaceStepProps {
  formData: {
    workspaceType: "new" | "existing";
    workspaceName: string;
    workspaceId?: string;
  };
  onUpdate: (data: Partial<WorkspaceStepProps["formData"]>) => void;
  onComplete: () => void;
  onBack: () => void;
}

const WorkspaceStep = ({ formData, onUpdate, onComplete, onBack }: WorkspaceStepProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.workspaceType === "new" && !formData.workspaceName.trim()) {
      newErrors.workspaceName = "Workspace name is required";
    }
    if (formData.workspaceType === "existing" && !formData.workspaceId?.trim()) {
      newErrors.workspaceId = "Workspace ID is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onComplete();
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-[var(--glass-bg)] border-[var(--glass-border)] backdrop-blur-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
          Setup Workspace
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Choose how you want to manage your workspace
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Label className="text-sm font-medium text-foreground">Workspace Options</Label>
            <RadioGroup
              value={formData.workspaceType}
              onValueChange={(value: "new" | "existing") =>
                onUpdate({ workspaceType: value, workspaceName: "", workspaceId: "" })
              }
              className="space-y-3"
            >
              <div className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors bg-background/30">
                <RadioGroupItem value="new" id="new" className="text-primary" />
                <div className="flex items-center space-x-3 flex-1">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Plus className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <Label
                      htmlFor="new"
                      className="text-sm font-medium text-foreground cursor-pointer"
                    >
                      Create New Workspace
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Start fresh with a new workspace
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors bg-background/30">
                <RadioGroupItem value="existing" id="existing" className="text-primary" />
                <div className="flex items-center space-x-3 flex-1">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <Label
                      htmlFor="existing"
                      className="text-sm font-medium text-foreground cursor-pointer"
                    >
                      Join Existing Workspace
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Join a workspace using an invitation ID
                    </p>
                  </div>
                </div>
              </div>
            </RadioGroup>
          </div>

          {formData.workspaceType === "new" && (
            <div className="space-y-2">
              <Label htmlFor="workspaceName" className="text-sm font-medium text-foreground">
                Workspace Name
              </Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="workspaceName"
                  type="text"
                  placeholder="My Company"
                  value={formData.workspaceName}
                  onChange={(e) => onUpdate({ workspaceName: e.target.value })}
                  className={`pl-10 bg-background/50 border-border ${
                    errors.workspaceName ? "border-destructive" : ""
                  }`}
                />
              </div>
              {errors.workspaceName && (
                <p className="text-xs text-destructive">{errors.workspaceName}</p>
              )}
            </div>
          )}

          {formData.workspaceType === "existing" && (
            <div className="space-y-2">
              <Label htmlFor="workspaceId" className="text-sm font-medium text-foreground">
                Workspace ID
              </Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="workspaceId"
                  type="text"
                  placeholder="Enter workspace invitation ID"
                  value={formData.workspaceId || ""}
                  onChange={(e) => onUpdate({ workspaceId: e.target.value })}
                  className={`pl-10 bg-background/50 border-border ${
                    errors.workspaceId ? "border-destructive" : ""
                  }`}
                />
              </div>
              {errors.workspaceId && (
                <p className="text-xs text-destructive">{errors.workspaceId}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Ask your team admin for the workspace invitation ID
              </p>
            </div>
          )}

          <div className="flex space-x-3 mt-6">
            <Button type="button" variant="outline" onClick={onBack} className="flex-1">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button type="submit" variant="default" className="flex-1">
              Complete Setup
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default WorkspaceStep;
