import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AppTable, type TableColumn, type TablePaginationProps } from "@/components/ui/app-table";
import { FileText, Calendar, Receipt, Search } from "lucide-react";

interface BillingRecord {
  id: string;
  client: {
    id: string;
    name: string;
    company: string;
  };
  billedAmount: number;
  currency: string;
  billingCycle?: string;
  paymentTerms?: string;
  userPercentage: number;
  billingStatus: "PENDING" | "PAID" | "OVERDUE";
  billingDate?: Date;
  billingDueDate?: Date;
  billingNotes?: string;
  billingAttachments: string[];
  workspace: {
    id: string;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Sample billing data
const sampleBillingRecords: BillingRecord[] = [
  {
    id: "bill_001",
    client: {
      id: "client_1",
      name: "John Doe",
      company: "TechCorp Industries",
    },
    billedAmount: 5000.0,
    currency: "USD",
    billingCycle: "monthly",
    paymentTerms: "net 30",
    userPercentage: 15.0,
    billingStatus: "PAID",
    billingDate: new Date("2024-01-15"),
    billingDueDate: new Date("2024-02-14"),
    billingNotes: "Consulting services for Q1 project",
    billingAttachments: ["invoice_001.pdf", "contract.pdf"],
    workspace: {
      id: "ws_1",
      name: "Main Workspace",
    },
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-16"),
  },
  {
    id: "bill_002",
    client: {
      id: "client_2",
      name: "Emily Chen",
      company: "Startup.io",
    },
    billedAmount: 12500.0,
    currency: "USD",
    billingCycle: "quarterly",
    paymentTerms: "net 15",
    userPercentage: 20.0,
    billingStatus: "PENDING",
    billingDate: new Date("2024-01-20"),
    billingDueDate: new Date("2024-02-04"),
    billingNotes: "Software development and maintenance",
    billingAttachments: ["invoice_002.pdf"],
    workspace: {
      id: "ws_1",
      name: "Main Workspace",
    },
    createdAt: new Date("2024-01-18"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "bill_003",
    client: {
      id: "client_3",
      name: "David Wilson",
      company: "Enterprise Solutions Ltd",
    },
    billedAmount: 25000.0,
    currency: "USD",
    billingCycle: "annually",
    paymentTerms: "net 60",
    userPercentage: 25.0,
    billingStatus: "OVERDUE",
    billingDate: new Date("2023-12-01"),
    billingDueDate: new Date("2024-01-30"),
    billingNotes: "Annual enterprise license and support",
    billingAttachments: ["invoice_003.pdf", "license_agreement.pdf", "support_contract.pdf"],
    workspace: {
      id: "ws_1",
      name: "Main Workspace",
    },
    createdAt: new Date("2023-11-25"),
    updatedAt: new Date("2024-01-15"),
  },
];

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
  searchTerm: string;
  statusFilter: string;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

const BillingTable = ({
  searchTerm,
  statusFilter,
  currentPage,
  itemsPerPage,
  onPageChange,
  onPageSizeChange,
}: BillingTableProps) => {
  const filteredBillingRecords = sampleBillingRecords.filter((record) => {
    const matchesSearch =
      record.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.id.toLowerCase().includes(searchTerm.toLowerCase());

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
        <Button>
          <FileText className="h-4 w-4 mr-2" />
          Create First Invoice
        </Button>
      </div>
    );
  };

  // Define table columns for AppTable
  const columns: TableColumn<BillingRecord>[] = [
    {
      key: "id",
      header: "Invoice ID",
      render: (record) => <span className="font-medium">{record.id}</span>,
    },
    {
      key: "client",
      header: "Client",
      render: (record) => (
        <div>
          <div className="font-medium">{record.client.name}</div>
          <div className="text-sm text-muted-foreground">{record.client.company}</div>
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
      render: (record) => <span className="capitalize">{record.billingCycle || "—"}</span>,
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
              {record.billingDueDate.toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
              })}
            </span>
          </div>
        ) : (
          "—"
        ),
    },
    {
      key: "userPercentage",
      header: "Commission",
      render: (record) => formatPercentage(record.userPercentage),
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
      getItemId={(record) => record.id}
      pagination={paginationProps}
      emptyState={<EmptyState />}
    />
  );
};

export default BillingTable;
