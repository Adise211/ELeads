import { useState, useEffect } from "react";
import { DollarSign, CheckCircle, Clock, AlertCircle } from "lucide-react";
import StatsCards from "@/components/core/StatsCards";
import { BillingTable, BillingActionBar } from "@/components/core/Billing";
import { showSuccessToast } from "@/utils/toast";
import { types } from "@eleads/shared";
import { useWorkspaceStore } from "@/stores/workspaceStore";

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

const BillingPage = () => {
  const workspaceBillings = useWorkspaceStore((state) => state.workspaceBillings);
  const [billings, setBillings] = useState<types.BillingDTO[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    console.log("workspaceBillings in billing page", workspaceBillings);
    setBillings(workspaceBillings);
  }, [workspaceBillings]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const filteredBillings = billings.filter((record) => {
    const matchesSearch =
      record.clientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.billedAmount.toString().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || record.billingStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateInvoice = () => {
    // TODO: Implement actual invoice creation logic
    // This would typically involve calling an API service
    showSuccessToast("Invoice created successfully!");
  };

  const totalBilled = filteredBillings.reduce((sum, record) => sum + record.billedAmount, 0);
  // filter billings by status
  const paidAmount = filteredBillings
    .filter((record) => record.billingStatus === types.BillingStatus.PAID)
    .reduce((sum, record) => sum + record.billedAmount, 0);
  const pendingAmount = filteredBillings
    .filter((record) => record.billingStatus === types.BillingStatus.PENDING)
    .reduce((sum, record) => sum + record.billedAmount, 0);
  const overdueAmount = filteredBillings
    .filter((record) => record.billingStatus === types.BillingStatus.OVERDUE)
    .reduce((sum, record) => sum + record.billedAmount, 0);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Billing</h1>
          <p className="text-muted-foreground">Manage client billing and invoices</p>
        </div>

        {/* Summary Cards */}
        <StatsCards
          cards={[
            {
              title: "Total Billed",
              value: formatCurrency(totalBilled, "USD"),
              description: "All billing records",
              icon: DollarSign,
            },
            {
              title: "Paid",
              value: formatCurrency(paidAmount, "USD"),
              description: "Successfully paid invoices",
              icon: CheckCircle,
              valueColor: "text-emerald-700",
            },
            {
              title: "Pending",
              value: formatCurrency(pendingAmount, "USD"),
              description: "Awaiting payment",
              icon: Clock,
              valueColor: "text-amber-600",
            },
            {
              title: "Overdue",
              value: formatCurrency(overdueAmount, "USD"),
              description: "Past due invoices",
              icon: AlertCircle,
              valueColor: "text-rose-700",
            },
          ]}
        />

        {/* Billing Action Bar */}
        <BillingActionBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          onCreateInvoice={handleCreateInvoice}
        />

        {/* Billing Table Component */}
        <BillingTable
          billings={filteredBillings}
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onPageSizeChange={(newPageSize) => {
            setItemsPerPage(newPageSize);
            setCurrentPage(1); // Reset to first page when changing page size
          }}
        />
      </div>
    </div>
  );
};

export default BillingPage;
