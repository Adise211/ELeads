import ChartSection from "@/components/core/Dashboard/ChartSection";
import CardsSection from "@/components/core/Dashboard/CardsSection";
import LastActivityCard from "@/components/core/Leads/LastActivityCard";
import NewestClientsCard from "@/components/core/Dashboard/NewestClientsCard";
import DataViewToggle from "@/components/core/Dashboard/DataViewToggle";
// import { types } from "@eleads/shared";
import WelcomeDialog from "@/components/core/WelcomeDialog";
import { useState } from "react";

const HomePage = () => {
  const [isPersonalView, setIsPersonalView] = useState(false);

  return (
    <div className="flex flex-1 flex-col">
      <WelcomeDialog />
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Toggle and Cards Section */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center px-4 lg:px-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  {isPersonalView ? "Your Dashboard" : "Workspace Dashboard"}
                </h2>
                <p className="text-muted-foreground">
                  {isPersonalView
                    ? "View your personal leads, clients, and activities"
                    : "View workspace-wide leads, clients, and activities"}
                </p>
              </div>
              <DataViewToggle isPersonalView={isPersonalView} onToggle={setIsPersonalView} />
            </div>
            <CardsSection isPersonalView={isPersonalView} />
          </div>

          <div className="px-4 lg:px-6">
            <ChartSection isPersonalView={isPersonalView} />
          </div>

          <div className="px-4 lg:px-6">
            <div className="grid gap-4 md:grid-cols-2">
              <LastActivityCard isPersonalView={isPersonalView} />
              <NewestClientsCard isPersonalView={isPersonalView} />
            </div>
          </div>
          {/* <DataTable data={data} /> */}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
