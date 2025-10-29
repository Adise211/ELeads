import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Filter } from "lucide-react";
import { useEffect, useState } from "react";
import ClientDialog from "./ClientDialog";
import { types, schemas } from "@eleads/shared";
import { useAuthStore } from "@/stores/authStore";

const DEFAULT_CLIENT: types.ClientDTO = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  country: "",
  company: "",
  industry: "",
  website: "",
  status: types.ClientStatus.PROSPECT,
  priority: types.ClientPriority.MEDIUM,
  workspaceId: "",
  leadId: "",
  assignedToId: "",
};

interface ClientsActionBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  priorityFilter: string;
  setPriorityFilter: (value: string) => void;
  onCreateClient: (clientData: types.ClientDTO) => void;
  isCreating?: boolean;
}

const ClientsActionBar = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  onCreateClient,
  isCreating = false,
}: ClientsActionBarProps) => {
  const user = useAuthStore((state) => state.user);
  const [isCreateClientOpen, setIsCreateClientOpen] = useState(false);
  const [newClient, setNewClient] = useState<types.ClientDTO>({ ...DEFAULT_CLIENT });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleCreateClient = () => {
    // Reset errors
    setErrors({});

    // Set workspace ID from user
    const clientWithWorkspace = {
      ...newClient,
      workspaceId: user?.workspaceId || "",
    };

    const validationResult = schemas.createClientSchema.safeParse(clientWithWorkspace);
    if (!validationResult.success) {
      validationResult.error.issues.forEach((issue) => {
        setErrors((prev) => ({ ...prev, [issue.path.join(".")]: issue.message }));
      });
      return;
    } else {
      // Call the parent handler with the client data
      onCreateClient(clientWithWorkspace);

      // Reset form and close dialog
      setNewClient({ ...DEFAULT_CLIENT });
      setIsCreateClientOpen(false);
    }
  };

  useEffect(() => {
    // Reset form and errors when dialog is closed
    if (!isCreateClientOpen) {
      setNewClient({ ...DEFAULT_CLIENT });
      setErrors({});
    }
  }, [isCreateClientOpen]);

  return (
    <div className="clients-action-bar flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-100">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search clients by name, company, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
              <SelectItem value="PROSPECT">Prospect</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[150px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Priorities</SelectItem>
              <SelectItem value="LOW">Low</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
              <SelectItem value="VIP">VIP</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex gap-2">
        <Button onClick={() => setIsCreateClientOpen(true)} disabled={isCreating}>
          <Plus className="h-4 w-4 mr-2" />
          {isCreating ? "Creating..." : "Add Client"}
        </Button>
      </div>

      {/* Create Client Dialog */}
      <ClientDialog
        isOpen={isCreateClientOpen}
        onOpenChange={setIsCreateClientOpen}
        client={newClient}
        onClientChange={setNewClient}
        onSubmit={handleCreateClient}
        errors={errors}
        isEditMode={false}
      />
    </div>
  );
};

export default ClientsActionBar;
