import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { types } from "@eleads/shared";

interface ClientDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  client: types.ClientDTO;
  onClientChange: (client: types.ClientDTO) => void;
  onSubmit: () => void;
  errors: Record<string, string>;
  isEditMode?: boolean;
}

const ClientDialog = ({
  isOpen,
  onOpenChange,
  client,
  onClientChange,
  onSubmit,
  errors,
  isEditMode = false,
}: ClientDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[90vw] !w-[70vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Client" : "Add New Client"}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the client information below."
              : "Fill in the client information to add them to your workspace."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Row 1: Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name</Label>
              <Input
                id="clientName"
                value={client.name || ""}
                onChange={(e) => onClientChange({ ...client, name: e.target.value })}
                placeholder="John Doe"
                error={errors.name}
              />
              {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientEmail">Email *</Label>
              <Input
                id="clientEmail"
                type="email"
                value={client.email}
                onChange={(e) => onClientChange({ ...client, email: e.target.value })}
                placeholder="john.doe@example.com"
                error={errors.email}
              />
            </div>
          </div>

          {/* Row 2: Contact Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientPhone">Phone *</Label>
              <Input
                id="clientPhone"
                value={client.phone}
                onChange={(e) => onClientChange({ ...client, phone: e.target.value })}
                placeholder="+1-555-0101"
                error={errors.phone}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientWebsite">Website</Label>
              <Input
                id="clientWebsite"
                value={client.website || ""}
                onChange={(e) => onClientChange({ ...client, website: e.target.value })}
                placeholder="https://example.com"
                error={errors.website}
              />
            </div>
          </div>

          {/* Row 3: Company Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientCompany">Company *</Label>
              <Input
                id="clientCompany"
                value={client.company}
                onChange={(e) => onClientChange({ ...client, company: e.target.value })}
                placeholder="TechCorp Inc."
                error={errors.company}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientIndustry">Industry</Label>
              <Input
                id="clientIndustry"
                value={client.industry || ""}
                onChange={(e) => onClientChange({ ...client, industry: e.target.value })}
                placeholder="Technology"
                error={errors.industry}
              />
            </div>
          </div>

          {/* Row 4: Status and Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientStatus">Status *</Label>
              <Select
                value={client.status}
                onValueChange={(value) =>
                  onClientChange({ ...client, status: value as types.ClientStatus })
                }
              >
                <SelectTrigger className={errors.status ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                  <SelectItem value="PROSPECT">Prospect</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && <p className="text-sm text-red-500 mt-1">{errors.status}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientPriority">Priority *</Label>
              <Select
                value={client.priority}
                onValueChange={(value) =>
                  onClientChange({ ...client, priority: value as types.ClientPriority })
                }
              >
                <SelectTrigger className={errors.priority ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="VIP">VIP</SelectItem>
                </SelectContent>
              </Select>
              {errors.priority && <p className="text-sm text-red-500 mt-1">{errors.priority}</p>}
            </div>
          </div>

          {/* Row 5: Address Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientAddress">Address</Label>
              <Input
                id="clientAddress"
                value={client.address || ""}
                onChange={(e) => onClientChange({ ...client, address: e.target.value })}
                placeholder="123 Main St"
                error={errors.address}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientCity">City</Label>
              <Input
                id="clientCity"
                value={client.city || ""}
                onChange={(e) => onClientChange({ ...client, city: e.target.value })}
                placeholder="San Francisco"
                error={errors.city}
              />
            </div>
          </div>

          {/* Row 6: Location Details */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientState">State</Label>
              <Input
                id="clientState"
                value={client.state || ""}
                onChange={(e) => onClientChange({ ...client, state: e.target.value })}
                placeholder="CA"
                error={errors.state}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientZipCode">Zip Code</Label>
              <Input
                id="clientZipCode"
                value={client.zipCode || ""}
                onChange={(e) => onClientChange({ ...client, zipCode: e.target.value })}
                placeholder="94105"
                error={errors.zipCode}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientCountry">Country *</Label>
              <Input
                id="clientCountry"
                value={client.country}
                onChange={(e) => onClientChange({ ...client, country: e.target.value })}
                placeholder="USA"
                error={errors.country}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>{isEditMode ? "Update Client" : "Add Client"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ClientDialog;
