import ChartSection from "@/components/core/Dashboard/ChartSection";
import CardsSection from "@/components/core/Dashboard/CardsSection";
import LastActivityCard from "@/components/core/Leads/LastActivityCard";
import NewestClientsCard from "@/components/core/Dashboard/NewestClientsCard";
// import { types } from "@eleads/shared";
import WelcomeDialog from "@/components/core/WelcomeDialog";
import { useWorkspaceStore } from "@/stores/workspaceStore";

const HomePage = () => {
  const workspaceLeads = useWorkspaceStore((state) => state.workspaceLeads);
  const workspaceClients = useWorkspaceStore((state) => state.workspaceClients);

  return (
    <div className="flex flex-1 flex-col">
      <WelcomeDialog />
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <CardsSection />
          <div className="px-4 lg:px-6">
            <ChartSection />
          </div>
          <div className="px-4 lg:px-6">
            <div className="grid gap-4 md:grid-cols-2">
              <LastActivityCard leads={workspaceLeads} />
              <NewestClientsCard clients={workspaceClients} />
            </div>
          </div>
          {/* <DataTable data={data} /> */}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
