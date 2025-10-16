import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useWorkspaceStore } from "@/stores/workspaceStore";
import { useUserDataStore } from "@/stores/userDataStore";

interface ChartSectionProps {
  isPersonalView: boolean;
}

export const description = "An interactive area chart";

const chartConfig = {
  leads: {
    label: "Leads",
  },
  leadsCreated: {
    label: "Leads Created",
    color: "var(--primary)",
  },
  clientsCreated: {
    label: "Clients Created",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const ChartSection = ({ isPersonalView }: ChartSectionProps) => {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("90d");

  // Workspace data
  const workspaceLeads = useWorkspaceStore((state) => state.workspaceLeads);
  const workspaceClients = useWorkspaceStore((state) => state.workspaceClients);

  // User personal data
  const userLeads = useUserDataStore((state) => state.userLeads);
  const userClients = useUserDataStore((state) => state.userClients);

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  // Use appropriate data based on view
  const leads = isPersonalView ? userLeads : workspaceLeads;
  const clients = isPersonalView ? userClients : workspaceClients;

  // Generate chart data from actual data
  const generateChartData = () => {
    const now = new Date();
    let daysToShow = 90;
    if (timeRange === "30d") {
      daysToShow = 30;
    } else if (timeRange === "7d") {
      daysToShow = 7;
    }

    const data = [];
    for (let i = daysToShow - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      // Count leads created on this date
      const leadsCreated = leads.filter((lead) => {
        if (!lead.createdAt) return false;
        const leadDate = new Date(lead.createdAt).toISOString().split("T")[0];
        return leadDate === dateStr;
      }).length;

      // Count clients created on this date
      const clientsCreated = clients.filter((client) => {
        if (!client.createdAt) return false;
        const clientDate = new Date(client.createdAt).toISOString().split("T")[0];
        return clientDate === dateStr;
      }).length;

      data.push({
        date: dateStr,
        leadsCreated,
        clientsCreated,
      });
    }

    return data;
  };

  const filteredData = generateChartData();

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>{isPersonalView ? "Your Activity" : "Workspace Activity"}</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            {isPersonalView
              ? "Your leads and clients activity"
              : "Workspace leads and clients activity"}
          </span>
          <span className="@[540px]/card:hidden">
            {isPersonalView ? "Your activity" : "Workspace activity"}
          </span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillLeadsCreated" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-leadsCreated)" stopOpacity={1.0} />
                <stop offset="95%" stopColor="var(--color-leadsCreated)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillClientsCreated" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-clientsCreated)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-clientsCreated)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="leadsCreated"
              type="natural"
              fill="url(#fillLeadsCreated)"
              stroke="var(--color-leadsCreated)"
              stackId="a"
            />
            <Area
              dataKey="clientsCreated"
              type="natural"
              fill="url(#fillClientsCreated)"
              stroke="var(--color-clientsCreated)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ChartSection;
