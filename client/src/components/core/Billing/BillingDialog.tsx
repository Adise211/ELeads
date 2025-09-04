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
import { Textarea } from "@/components/ui/textarea";

interface BillingDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: InvoiceData;
  onInvoiceChange: (invoice: InvoiceData) => void;
  onSubmit: () => void;
  errors: Record<string, string>;
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

const BillingDialog = ({
  isOpen,
  onOpenChange,
  invoice,
  onInvoiceChange,
  onSubmit,
  errors,
}: BillingDialogProps) => {
  const isSubmitDisabled = !invoice.clientName || !invoice.billedAmount || !invoice.billingDueDate;

  // Sample clients data - in real app this would come from props or API
  const sampleClients = [
    { id: "client_1", name: "John Doe", company: "TechCorp Industries" },
    { id: "client_2", name: "Emily Chen", company: "Startup.io" },
    { id: "client_3", name: "David Wilson", company: "Enterprise Solutions Ltd" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[90vw] !w-[60vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Invoice</DialogTitle>
          <DialogDescription>
            Create a new invoice for your client. Fill in all the required billing information.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          {/* Client Information */}
          <div className="col-span-2 space-y-4">
            <h3 className="text-lg font-medium">Client Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clientName">Client Name *</Label>
                <Select
                  value={invoice.clientId}
                  onValueChange={(value) => {
                    const client = sampleClients.find((c) => c.id === value);
                    onInvoiceChange({
                      ...invoice,
                      clientId: value,
                      clientName: client?.name || "",
                      clientCompany: client?.company || "",
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    {sampleClients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name} - {client.company}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.clientName && <p className="text-sm text-red-500">{errors.clientName}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientCompany">Company</Label>
                <Input
                  id="clientCompany"
                  value={invoice.clientCompany}
                  onChange={(e) => onInvoiceChange({ ...invoice, clientCompany: e.target.value })}
                  placeholder="Company name"
                  error={errors.clientCompany}
                />
              </div>
            </div>
          </div>

          {/* Billing Amount */}
          <div className="space-y-2">
            <Label htmlFor="billedAmount">Amount *</Label>
            <div className="flex gap-2">
              <Select
                value={invoice.currency}
                onValueChange={(value) => onInvoiceChange({ ...invoice, currency: value })}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="CAD">CAD</SelectItem>
                </SelectContent>
              </Select>
              <Input
                id="billedAmount"
                type="number"
                step="0.01"
                value={invoice.billedAmount}
                onChange={(e) =>
                  onInvoiceChange({ ...invoice, billedAmount: parseFloat(e.target.value) || 0 })
                }
                placeholder="0.00"
                error={errors.billedAmount}
                className="flex-1"
              />
            </div>
          </div>

          {/* Commission Percentage */}
          <div className="space-y-2">
            <Label htmlFor="userCommission">Commission %</Label>
            <Input
              id="userCommission"
              type="number"
              step="0.1"
              value={invoice.userCommission}
              onChange={(e) =>
                onInvoiceChange({ ...invoice, userCommission: parseFloat(e.target.value) || 0 })
              }
              placeholder="15.0"
              error={errors.userCommission}
            />
          </div>

          {/* Billing Cycle */}
          <div className="space-y-2">
            <Label htmlFor="billingCycle">Billing Cycle</Label>
            <Select
              value={invoice.billingCycle}
              onValueChange={(value) => onInvoiceChange({ ...invoice, billingCycle: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select cycle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="one-time">One Time</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="annually">Annually</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Payment Terms */}
          <div className="space-y-2">
            <Label htmlFor="paymentTerms">Payment Terms</Label>
            <Select
              value={invoice.paymentTerms}
              onValueChange={(value) => onInvoiceChange({ ...invoice, paymentTerms: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select terms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="net 0">Net 0</SelectItem>
                <SelectItem value="net 7">Net 7</SelectItem>
                <SelectItem value="net 15">Net 15</SelectItem>
                <SelectItem value="net 30">Net 30</SelectItem>
                <SelectItem value="net 60">Net 60</SelectItem>
                <SelectItem value="net 90">Net 90</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Billing Date */}
          <div className="space-y-2">
            <Label htmlFor="billingDate">Billing Date</Label>
            <Input
              id="billingDate"
              type="date"
              value={invoice.billingDate}
              onChange={(e) => onInvoiceChange({ ...invoice, billingDate: e.target.value })}
              error={errors.billingDate}
            />
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label htmlFor="billingDueDate">Due Date *</Label>
            <Input
              id="billingDueDate"
              type="date"
              value={invoice.billingDueDate}
              onChange={(e) => onInvoiceChange({ ...invoice, billingDueDate: e.target.value })}
              error={errors.billingDueDate}
            />
          </div>

          {/* Description */}
          <div className="col-span-2 space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={invoice.description}
              onChange={(e) => onInvoiceChange({ ...invoice, description: e.target.value })}
              placeholder="Brief description of services or products"
              error={errors.description}
            />
          </div>

          {/* Billing Notes */}
          <div className="col-span-2 space-y-2">
            <Label htmlFor="billingNotes">Billing Notes</Label>
            <Textarea
              id="billingNotes"
              value={invoice.billingNotes}
              onChange={(e) => onInvoiceChange({ ...invoice, billingNotes: e.target.value })}
              placeholder="Additional notes, terms, or special instructions..."
              className="min-h-[100px]"
            />
            {errors.billingNotes && <p className="text-sm text-red-500">{errors.billingNotes}</p>}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={isSubmitDisabled}>
            Create Invoice
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BillingDialog;
