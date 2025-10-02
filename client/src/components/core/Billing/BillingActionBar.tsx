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
import BillingDialog from "./BillingDialog";
import { types, schemas } from "@eleads/shared";

const DEFAULT_INVOICE: types.BillingDTO = {
  clientId: "",
  billedAmount: 0,
  currency: "USD",
  billingCycle: "one-time",
  paymentTerms: "net 30",
  userCommission: 15,
  billingStatus: types.BillingStatus.PENDING,
  billingDate: new Date().toISOString().split("T")[0],
  billingDueDate: "",
  billingNotes: "",
  billingAttachments: [],
};

interface BillingActionBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  onCreateInvoice: (billingData: types.BillingDTO) => void;
  isCreating?: boolean;
  editInvoice?: types.BillingDTO | null;
  onEditInvoice?: (billingData: types.BillingDTO) => void;
  onCancelEdit?: () => void;
}

const BillingActionBar = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  onCreateInvoice,
  isCreating = false,
  editInvoice,
  onEditInvoice,
  onCancelEdit,
}: BillingActionBarProps) => {
  const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false);
  const [isEditInvoiceOpen, setIsEditInvoiceOpen] = useState(false);
  const [newInvoice, setNewInvoice] = useState<types.BillingDTO>({ ...DEFAULT_INVOICE });
  const [editInvoiceData, setEditInvoiceData] = useState<types.BillingDTO>({ ...DEFAULT_INVOICE });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});

  const handleCreateInvoice = () => {
    // Reset errors
    setErrors({});
    const validationResult = schemas.createBillingSchema.safeParse(newInvoice);
    if (!validationResult.success) {
      validationResult.error.issues.forEach((issue) => {
        setErrors((prev) => ({ ...prev, [issue.path.join(".")]: issue.message }));
      });
      return;
    } else {
      // Call the parent handler with the invoice data
      onCreateInvoice(newInvoice);

      // Reset form and close dialog
      setNewInvoice({ ...DEFAULT_INVOICE });
      setIsCreateInvoiceOpen(false);
    }
  };

  const handleEditInvoice = () => {
    // Reset errors
    setEditErrors({});
    const validationResult = schemas.createBillingSchema.safeParse(editInvoiceData);
    if (!validationResult.success) {
      validationResult.error.issues.forEach((issue) => {
        setEditErrors((prev) => ({ ...prev, [issue.path.join(".")]: issue.message }));
      });
      return;
    } else {
      // Call the parent handler with the invoice data
      if (onEditInvoice) {
        onEditInvoice(editInvoiceData);
      }

      // Reset form and close dialog
      setEditInvoiceData({ ...DEFAULT_INVOICE });
      setIsEditInvoiceOpen(false);
    }
  };

  // Handle edit invoice prop changes
  useEffect(() => {
    if (editInvoice) {
      setEditInvoiceData({ ...editInvoice });
      setIsEditInvoiceOpen(true);
    }
  }, [editInvoice]);

  useEffect(() => {
    // Reset form and errors when dialog is closed
    if (!isCreateInvoiceOpen) {
      setNewInvoice({ ...DEFAULT_INVOICE });
      setErrors({});
    }
    if (!isEditInvoiceOpen) {
      setEditInvoiceData({ ...DEFAULT_INVOICE });
      setEditErrors({});
      if (onCancelEdit) {
        onCancelEdit();
      }
    }
  }, [isCreateInvoiceOpen, isEditInvoiceOpen, onCancelEdit]);

  return (
    <div className="billing-action-bar flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-100">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search invoices by client name, company, or ID..."
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
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="PAID">Paid</SelectItem>
              <SelectItem value="OVERDUE">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex gap-2">
        <Button onClick={() => setIsCreateInvoiceOpen(true)} disabled={isCreating}>
          <Plus className="h-4 w-4 mr-2" />
          {isCreating ? "Creating..." : "Create Invoice"}
        </Button>
      </div>

      {/* Create Billing Dialog */}
      <BillingDialog
        isOpen={isCreateInvoiceOpen}
        onOpenChange={setIsCreateInvoiceOpen}
        invoice={newInvoice}
        onInvoiceChange={setNewInvoice}
        onSubmit={handleCreateInvoice}
        errors={errors}
        isEditMode={false}
      />

      {/* Edit Billing Dialog */}
      <BillingDialog
        isOpen={isEditInvoiceOpen}
        onOpenChange={setIsEditInvoiceOpen}
        invoice={editInvoiceData}
        onInvoiceChange={setEditInvoiceData}
        onSubmit={handleEditInvoice}
        errors={editErrors}
        isEditMode={true}
      />
    </div>
  );
};

export default BillingActionBar;
