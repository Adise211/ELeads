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
import { types } from "@eleads/shared";
import { useWorkspaceStore } from "@/stores/workspaceStore";
import { useState } from "react";
import { Upload, X, FileText } from "lucide-react";

interface BillingDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: types.BillingDTO;
  onInvoiceChange: (invoice: types.BillingDTO) => void;
  onSubmit: () => void;
  errors: Record<string, string>;
}

const BillingDialog = ({
  isOpen,
  onOpenChange,
  invoice,
  onInvoiceChange,
  onSubmit,
  errors,
}: BillingDialogProps) => {
  // const isSubmitDisabled = !invoice.clientId || !invoice.billedAmount || !invoice.billingDueDate;
  const workspaceClients = useWorkspaceStore((state) => state.workspaceClients);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const clients = workspaceClients.map((client) => ({
    id: client.id,
    name: client.name,
    company: client.company,
  }));

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles((prev) => [...prev, ...files]);

    // Update the invoice with file names
    const fileNames = [...uploadedFiles, ...files].map((file) => file.name);
    onInvoiceChange({
      ...invoice,
      billingAttachments: fileNames,
    });
  };

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);

    // Update the invoice with remaining file names
    const fileNames = newFiles.map((file) => file.name);
    onInvoiceChange({
      ...invoice,
      billingAttachments: fileNames,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[90vw] !w-[60vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Invoice</DialogTitle>
          <DialogDescription>
            Create a new invoice for your client. Fill in all the required billing information.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Row 1: Client Selection - Full Width */}
          <div className="space-y-2">
            <Label htmlFor="clientName" className="text-sm font-medium text-gray-700">
              Select Client *
            </Label>
            <Select
              value={invoice.clientId}
              onValueChange={(value) => {
                onInvoiceChange({
                  ...invoice,
                  clientId: value,
                });
              }}
            >
              <SelectTrigger
                className={`h-11 w-full ${errors.clientId ? "!border-red-500 focus:!border-red-500 focus:!ring-red-500" : ""}`}
              >
                <SelectValue placeholder="Choose a client from your workspace" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client?.id || ""}>
                    <div className="flex flex-col">
                      <span className="font-medium">{client.company}</span>
                      <span className="text-sm text-gray-500">{client.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.clientId && <p className="text-sm text-red-500 mt-1">{errors.clientId}</p>}
          </div>

          {/* Row 2: Financial Details - Two Columns */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="billedAmount" className="text-sm font-medium text-gray-700">
                Invoice Amount *
              </Label>
              <div className="flex gap-2">
                <Input
                  value="USD"
                  className="w-16 bg-gray-100 border-gray-200 text-center font-medium text-xs"
                  disabled
                />
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
                  className="flex-1 h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="userCommission" className="text-sm font-medium text-gray-700">
                Commission Percentage
              </Label>
              <div className="flex gap-2">
                <Input
                  id="userCommission"
                  type="number"
                  step="0.1"
                  value={invoice.userCommission}
                  onChange={(e) =>
                    onInvoiceChange({
                      ...invoice,
                      userCommission: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="15.0"
                  error={errors.userCommission}
                  className="flex-1 h-11"
                />
                <Input
                  value="%"
                  className="w-10 bg-gray-100 border-gray-200 text-center font-medium text-xs"
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Row 3: Billing Terms - Two Columns */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="billingCycle" className="text-sm font-medium text-gray-700">
                Billing Cycle
              </Label>
              <Select
                value={invoice.billingCycle}
                onValueChange={(value) => onInvoiceChange({ ...invoice, billingCycle: value })}
              >
                <SelectTrigger className="h-11 w-full">
                  <SelectValue placeholder="Select billing frequency" />
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

            <div className="space-y-2">
              <Label htmlFor="paymentTerms" className="text-sm font-medium text-gray-700">
                Payment Terms
              </Label>
              <Select
                value={invoice.paymentTerms}
                onValueChange={(value) => onInvoiceChange({ ...invoice, paymentTerms: value })}
              >
                <SelectTrigger className="h-11 w-full">
                  <SelectValue placeholder="Select payment terms" />
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
          </div>

          {/* Row 4: Important Dates - Two Columns */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="billingDate" className="text-sm font-medium text-gray-700">
                Billing Date
              </Label>
              <Input
                id="billingDate"
                type="date"
                value={invoice.billingDate}
                onChange={(e) => onInvoiceChange({ ...invoice, billingDate: e.target.value })}
                error={errors.billingDate}
                className="h-11 w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="billingDueDate" className="text-sm font-medium text-gray-700">
                Due Date *
              </Label>
              <Input
                id="billingDueDate"
                type="date"
                value={invoice.billingDueDate}
                onChange={(e) => onInvoiceChange({ ...invoice, billingDueDate: e.target.value })}
                error={errors.billingDueDate}
                className="h-11 w-full"
              />
            </div>
          </div>

          {/* Row 5: Billing Notes - Full Width */}
          <div className="space-y-2">
            <Label htmlFor="billingNotes" className="text-sm font-medium text-gray-700">
              Billing Notes
            </Label>
            <Textarea
              id="billingNotes"
              value={invoice.billingNotes}
              onChange={(e) => onInvoiceChange({ ...invoice, billingNotes: e.target.value })}
              placeholder="Add any additional notes, terms, or special instructions for this invoice..."
              className="min-h-[120px] resize-none w-full"
            />
            {errors.billingNotes && (
              <p className="text-sm text-red-500 mt-1">{errors.billingNotes}</p>
            )}
          </div>

          {/* Row 6: File Attachments - Full Width */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Attachments</Label>
            <div className="space-y-3">
              {/* File Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  accept=".xlsx,.xls,.json,.csv"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  <Upload className="h-8 w-8 text-gray-400" />
                  <div className="text-sm text-gray-600">
                    <span className="font-medium text-blue-600 hover:text-blue-500">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </div>
                  <div className="text-xs text-gray-500">
                    Excel (.xlsx, .xls), JSON (.json), CSV (.csv) up to 10MB each
                  </div>
                </label>
              </div>

              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-700">Uploaded Files:</div>
                  <div className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                      >
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-gray-400" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{file.name}</div>
                            <div className="text-xs text-gray-500">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </div>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="h-8 w-8 p-0 text-gray-400 hover:text-red-500"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {errors.billingAttachments && (
              <p className="text-sm text-red-500 mt-1">{errors.billingAttachments}</p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>Create Invoice</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BillingDialog;
