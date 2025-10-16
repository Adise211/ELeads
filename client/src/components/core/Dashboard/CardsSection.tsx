import { TrendingUp, TrendingDown, DollarSign, Users, UserCheck, Building2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useWorkspaceStore } from "@/stores/workspaceStore";
import { useUserDataStore } from "@/stores/userDataStore";
import { types } from "@eleads/shared";

interface CardsSectionProps {
  isPersonalView: boolean;
}

const CardsSection = ({ isPersonalView }: CardsSectionProps) => {
  // Workspace data
  const workspaceLeads = useWorkspaceStore((state) => state.workspaceLeads);
  const workspaceClients = useWorkspaceStore((state) => state.workspaceClients);
  const workspaceBillings = useWorkspaceStore((state) => state.workspaceBillings);

  // User personal data
  const userLeads = useUserDataStore((state) => state.userLeads);
  const userClients = useUserDataStore((state) => state.userClients);
  const userBillings = useUserDataStore((state) => state.userBillings);
  const userTotalRevenue = useUserDataStore((state) => state.userTotalRevenue);

  // Use appropriate data based on view
  const leads = isPersonalView ? userLeads : workspaceLeads;
  const clients = isPersonalView ? userClients : workspaceClients;
  const billings = isPersonalView ? userBillings : workspaceBillings;

  // Calculate metrics
  const totalRevenue = isPersonalView
    ? userTotalRevenue
    : billings
        .filter((billing) => billing.billingStatus === types.BillingStatus.PAID)
        .reduce((sum, billing) => sum + billing.billedAmount, 0);

  const newClientsThisMonth = clients.filter((client) => {
    if (!client.createdAt) return false;
    const now = new Date();
    const clientDate = new Date(client.createdAt);
    return (
      clientDate.getMonth() === now.getMonth() && clientDate.getFullYear() === now.getFullYear()
    );
  }).length;

  const activeClients = clients.filter(
    (client) => client.status === types.ClientStatus.ACTIVE
  ).length;

  // Calculate growth rates (simplified - comparing this month vs last month)
  const thisMonthLeads = leads.filter((lead) => {
    if (!lead.createdAt) return false;
    const now = new Date();
    const leadDate = new Date(lead.createdAt);
    return leadDate.getMonth() === now.getMonth() && leadDate.getFullYear() === now.getFullYear();
  }).length;

  const lastMonthLeads = leads.filter((lead) => {
    if (!lead.createdAt) return false;
    const now = new Date();
    const leadDate = new Date(lead.createdAt);
    const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
    const lastMonthYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
    return leadDate.getMonth() === lastMonth && leadDate.getFullYear() === lastMonthYear;
  }).length;

  const leadGrowthRate =
    lastMonthLeads > 0 ? ((thisMonthLeads - lastMonthLeads) / lastMonthLeads) * 100 : 0;
  const revenueGrowthRate = 12.5; // Simplified for demo

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getGrowthBadge = (rate: number) => {
    if (rate > 0) {
      return (
        <Badge variant="outline">
          <TrendingUp className="w-3 h-3" />+{rate.toFixed(1)}%
        </Badge>
      );
    } else if (rate < 0) {
      return (
        <Badge variant="outline">
          <TrendingDown className="w-3 h-3" />
          {rate.toFixed(1)}%
        </Badge>
      );
    } else {
      return <Badge variant="outline">0%</Badge>;
    }
  };
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatCurrency(totalRevenue)}
          </CardTitle>
          <CardAction>{getGrowthBadge(revenueGrowthRate)}</CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            <DollarSign className="size-4" />
            {isPersonalView ? "Your earned revenue" : "Total workspace revenue"}
          </div>
          <div className="text-muted-foreground">
            {billings.length} billing {billings.length === 1 ? "record" : "records"}
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>New Clients</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {newClientsThisMonth}
          </CardTitle>
          <CardAction>
            {getGrowthBadge(0)} {/* Simplified for demo */}
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            <UserCheck className="size-4" />
            {isPersonalView ? "Your new clients this month" : "New clients this month"}
          </div>
          <div className="text-muted-foreground">
            {clients.length} total {isPersonalView ? "your" : "workspace"} clients
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Active Clients</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {activeClients}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <Building2 className="w-3 h-3" />
              {clients.length > 0 ? Math.round((activeClients / clients.length) * 100) : 0}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            <Users className="size-4" />
            {isPersonalView ? "Your active clients" : "Workspace active clients"}
          </div>
          <div className="text-muted-foreground">
            {activeClients}/{clients.length} clients active
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>New Leads</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {thisMonthLeads}
          </CardTitle>
          <CardAction>{getGrowthBadge(leadGrowthRate)}</CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {leadGrowthRate > 0 ? (
              <TrendingUp className="size-4" />
            ) : (
              <TrendingDown className="size-4" />
            )}
            {isPersonalView ? "Your leads this month" : "New leads this month"}
          </div>
          <div className="text-muted-foreground">
            {leads.length} total {isPersonalView ? "your" : "workspace"} leads
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CardsSection;
