import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AppTable, type TableColumn, type TablePaginationProps } from "@/components/ui/app-table";
import { FileText, Calendar, Receipt, Search, Edit, Trash2 } from "lucide-react";
import { types, schemas } from "@eleads/shared";
import ProtectedUI from "@/components/providers/ProtectedUI";
import BillingDetailsDialog from "./BillingDetailsDialog";
import BillingDialog from "./BillingDialog";
import { useState } from "react";

const statusColors = {
  PENDING: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
  PAID: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300",
  OVERDUE: "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300",
};

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

const formatPercentage = (percentage: number) => {
  return `${percentage}%`;
};

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

// Function to normalize invoice data to ensure all fields have proper values
const normalizeInvoiceData = (invoice: types.BillingDTO): types.BillingDTO => {
  return {
    ...DEFAULT_INVOICE,
    ...invoice,
    clientId: invoice.clientId || "",
    billedAmount: invoice.billedAmount || 0,
    currency: invoice.currency || "USD",
    billingCycle: invoice.billingCycle || "one-time",
    paymentTerms: invoice.paymentTerms || "net 30",
    userCommission: invoice.userCommission || 0,
    billingStatus: invoice.billingStatus || types.BillingStatus.PENDING,
    billingDate: invoice.billingDate.split("T")[0] || new Date().toISOString().split("T")[0],
    billingDueDate: invoice.billingDueDate.split("T")[0] || "",
    billingNotes: invoice.billingNotes || "",
    billingAttachments: invoice.billingAttachments || [],
  };
};

interface BillingTableProps {
  billings: types.BillingDTO[];
  searchTerm: string;
  statusFilter: string;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onEditInvoice?: (billingData: types.BillingDTO) => void;
  onDeleteBilling?: (billingId: string) => void;
}

const generateInvoiceIdForDisplay = (index: number) => {
  const _index = index + 1;
  return `invoice_${_index.toString().padStart(4, "0")}`;
};

const BillingTable = ({
  billings,
  searchTerm,
  statusFilter,
  currentPage,
  itemsPerPage,
  onPageChange,
  onPageSizeChange,
  onEditInvoice,
  onDeleteBilling,
}: BillingTableProps) => {
  const [selectedBilling, setSelectedBilling] = useState<types.BillingDTO | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editInvoiceData, setEditInvoiceData] = useState<types.BillingDTO>({ ...DEFAULT_INVOICE });
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});

  const handleViewBilling = (billing: types.BillingDTO) => {
    setSelectedBilling(billing);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedBilling(null);
  };

  const handleEditBilling = (billing: types.BillingDTO) => {
    const normalizedData = normalizeInvoiceData(billing);
    setEditInvoiceData(normalizedData);
    setIsEditDialogOpen(true);
  };

  const handleEditInvoice = () => {
    // Reset errors
    setEditErrors({});
    const validationResult = schemas.updateBillingSchema.safeParse(editInvoiceData);
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
      // Close dialog and reset state
      setIsEditDialogOpen(false);
      setEditInvoiceData({ ...DEFAULT_INVOICE });
    }
  };

  const handleCancelEdit = () => {
    setIsEditDialogOpen(false);
    setEditInvoiceData({ ...DEFAULT_INVOICE });
    setEditErrors({});
  };

  // Get billing history for the selected billing (filter by clientId and billingCycle)
  const getBillingHistory = (billing: types.BillingDTO) => {
    if (billing.billingCycle === "one-time") return [];

    return billings
      .filter(
        (b) =>
          b.clientId === billing.clientId &&
          b.billingCycle === billing.billingCycle &&
          b.id !== billing.id
      )
      .sort((a, b) => new Date(b.billingDate).getTime() - new Date(a.billingDate).getTime());
  };

  const filteredBillingRecords = billings.filter((record) => {
    const matchesSearch =
      record.clientId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.billedAmount.toString().includes(searchTerm.toLowerCase());
    //TODO: add client name and company to the billing record and filter by them

    const matchesStatus = statusFilter === "all" || record.billingStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination configuration
  const totalItems = filteredBillingRecords.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginationProps: TablePaginationProps = {
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems,
    onPageChange,
    onPageSizeChange,
    pageSizeOptions: [5, 10, 20, 50],
  };

  // Custom empty state component
  const EmptyState = () => {
    const hasSearchOrFilter = searchTerm || statusFilter !== "all";

    if (hasSearchOrFilter) {
      return (
        <div className="flex flex-col items-center justify-center text-muted-foreground py-12">
          <Search className="h-12 w-12 mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">No invoices found</h3>
          <p className="text-center max-w-md">
            No billing records match your current search criteria. Try adjusting your filters or
            search terms.
          </p>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center text-muted-foreground py-12">
        <Receipt className="h-12 w-12 mb-4 opacity-50" />
        <h3 className="text-lg font-medium mb-2">No billing records yet</h3>
        <p className="text-center max-w-md mb-4">
          Get started by creating your first invoice. Track payments, manage client billing, and
          monitor your revenue.
        </p>
        {/* TODO: open create invoice dialog */}
        <Button>
          <FileText className="h-4 w-4 mr-2" />
          Create First Invoice
        </Button>
      </div>
    );
  };

  // Define table columns for AppTable
  const columns: TableColumn<types.BillingDTO>[] = [
    {
      key: "id",
      header: "Invoice ID",
      render: (_, index: number) => (
        <span className="font-medium">{generateInvoiceIdForDisplay(index)}</span>
      ),
    },
    {
      key: "client",
      header: "Client",
      render: (record) => (
        <div>
          <div className="font-medium">{record.client?.company}</div>
          <div className="text-sm text-muted-foreground">{record.client?.name}</div>
        </div>
      ),
    },
    {
      key: "billedAmount",
      header: "Amount",
      render: (record) => (
        <span className="font-semibold">
          {formatCurrency(record.billedAmount, record.currency)}
        </span>
      ),
    },
    {
      key: "billingCycle",
      header: "Cycle",
      render: (record) => <span className="capitalize">{record.billingCycle || "N/A"}</span>,
    },
    {
      key: "billingStatus",
      header: "Status",
      render: (record) => (
        <Badge className={statusColors[record.billingStatus]}>{record.billingStatus}</Badge>
      ),
    },
    {
      key: "billingDueDate",
      header: "Due Date",
      render: (record) =>
        record.billingDueDate ? (
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>
              {record.billingDueDate
                ? new Date(record.billingDueDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })
                : "N/A"}
            </span>
          </div>
        ) : (
          "N/A"
        ),
    },
    {
      key: "userCommission",
      header: "Commission",
      render: (record) => formatPercentage(record.userCommission),
    },
    {
      key: "actions",
      header: "",
      render: (record) => (
        <div className="flex items-end justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleViewBilling(record)}
            title="View billing details"
          >
            <FileText className="h-4 w-4" />
          </Button>
          <ProtectedUI
            allowedPermissions={[types.Permission.EDIT_BILLING, types.Permission.MANAGE_BILLING]}
            allowedRoles={[types.UserRole.ADMIN]}
          >
            <Button variant="outline" size="sm" onClick={() => handleEditBilling(record)}>
              <Edit className="h-4 w-4" />
            </Button>
          </ProtectedUI>
          <ProtectedUI
            allowedPermissions={[types.Permission.DELETE_BILLING, types.Permission.MANAGE_BILLING]}
            allowedRoles={[types.UserRole.ADMIN]}
          >
            {onDeleteBilling && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDeleteBilling(record.id || "")}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </ProtectedUI>
        </div>
      ),
    },
  ];

  return (
    <>
      <AppTable
        data={filteredBillingRecords}
        columns={columns}
        getItemId={(record) => record.id || ""}
        pagination={paginationProps}
        emptyState={<EmptyState />}
      />

      {selectedBilling && (
        <BillingDetailsDialog
          billing={selectedBilling}
          isOpen={isDialogOpen}
          onClose={handleCloseDialog}
          billingHistory={getBillingHistory(selectedBilling)}
        />
      )}

      {/* Edit Billing Dialog */}
      <BillingDialog
        isOpen={isEditDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            handleCancelEdit();
          } else {
            setIsEditDialogOpen(open);
          }
        }}
        invoice={editInvoiceData}
        onInvoiceChange={setEditInvoiceData}
        onSubmit={handleEditInvoice}
        errors={editErrors}
        isEditMode={true}
      />
    </>
  );
};

export default BillingTable;
