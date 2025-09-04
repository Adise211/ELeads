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
import { useState } from "react";
import BillingDialog from "./BillingDialog";

interface BillingActionBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  onCreateInvoice: () => void;
}

interface InvoiceData {
  clientId: string;
  clientName: string;
  clientCompany: string;
  billedAmount: number;
  currency: string;
  billingCycle: string;
  paymentTerms: string;
  userCommission: number;
  billingDate: string;
  billingDueDate: string;
  billingNotes: string;
  description: string;
}

const DEFAULT_INVOICE: InvoiceData = {
  clientId: "",
  clientName: "",
  clientCompany: "",
  billedAmount: 0,
  currency: "USD",
  billingCycle: "one-time",
  paymentTerms: "net 30",
  userCommission: 15,
  billingDate: new Date().toISOString().split("T")[0],
  billingDueDate: "",
  billingNotes: "",
  description: "",
};

const BillingActionBar = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  onCreateInvoice,
}: BillingActionBarProps) => {
  const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false);
  const [newInvoice, setNewInvoice] = useState<InvoiceData>({ ...DEFAULT_INVOICE });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleCreateInvoice = () => {
    // Reset errors
    setErrors({});

    // Basic validation
    const newErrors: Record<string, string> = {};

    if (!newInvoice.clientName) {
      newErrors.clientName = "Client is required";
    }

    if (!newInvoice.billedAmount || newInvoice.billedAmount <= 0) {
      newErrors.billedAmount = "Amount must be greater than 0";
    }

    if (!newInvoice.billingDueDate) {
      newErrors.billingDueDate = "Due date is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // TODO: Call API to create invoice
    console.log("Creating invoice:", newInvoice);

    // Call the parent handler
    onCreateInvoice();

    // Reset form and close dialog
    setNewInvoice({ ...DEFAULT_INVOICE });
    setIsCreateInvoiceOpen(false);
  };

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
        <Button onClick={() => setIsCreateInvoiceOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Invoice
        </Button>
      </div>

      {/* Billing Dialog */}
      <BillingDialog
        isOpen={isCreateInvoiceOpen}
        onOpenChange={setIsCreateInvoiceOpen}
        invoice={newInvoice}
        onInvoiceChange={setNewInvoice}
        onSubmit={handleCreateInvoice}
        errors={errors}
      />
    </div>
  );
};

export default BillingActionBar;
