import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AppTable, type TableColumn, type TablePaginationProps } from "@/components/ui/app-table";
import { FileText, Calendar, Receipt, Search } from "lucide-react";
import { types } from "@eleads/shared";

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

interface BillingTableProps {
  billings: types.BillingDTO[];
  searchTerm: string;
  statusFilter: string;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
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
}: BillingTableProps) => {
  const filteredBillingRecords = billings.filter((record) => {
    const matchesSearch =
      record.clientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
      header: "Actions",
      render: () => (
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            View
          </Button>
        </div>
      ),
    },
  ];

  return (
    <AppTable
      data={filteredBillingRecords}
      columns={columns}
      getItemId={(record) => record.id || ""}
      pagination={paginationProps}
      emptyState={<EmptyState />}
    />
  );
};

export default BillingTable;
