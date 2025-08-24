import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DollarSign, CheckCircle, Clock, AlertCircle, Plus, Search, Filter } from "lucide-react";
import StatsCards from "@/components/core/StatsCards";
import BillingTable from "@/components/core/Billing/BillingTable";

// Sample billing data for stats calculation
const sampleBillingRecords = [
  {
    billedAmount: 5000.0,
    billingStatus: "PAID" as const,
  },
  {
    billedAmount: 12500.0,
    billingStatus: "PENDING" as const,
  },
  {
    billedAmount: 25000.0,
    billingStatus: "OVERDUE" as const,
  },
];

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

const BillingPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const totalBilled = sampleBillingRecords.reduce((sum, record) => sum + record.billedAmount, 0);
  const paidAmount = sampleBillingRecords
    .filter((record) => record.billingStatus === "PAID")
    .reduce((sum, record) => sum + record.billedAmount, 0);
  const pendingAmount = sampleBillingRecords
    .filter((record) => record.billingStatus === "PENDING")
    .reduce((sum, record) => sum + record.billedAmount, 0);
  const overdueAmount = sampleBillingRecords
    .filter((record) => record.billingStatus === "OVERDUE")
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

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
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
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Invoice
            </Button>
          </div>
        </div>

        {/* Billing Table Component */}
        <BillingTable
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
