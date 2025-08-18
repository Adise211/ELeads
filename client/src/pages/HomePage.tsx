import ChartSection from "@/components/core/Dashboard/ChartSection";
import CardsSection from "@/components/core/Dashboard/CardsSection";
import LastActivityCard from "@/components/core/Leads/LastActivityCard";
import { types } from "@eleads/shared";
import WelcomeDialog from "@/components/core/WelcomeDialog";

const HomePage = () => {
  // Mock data for LastActivityCard - you can replace this with real data from your API
  const mockLeads: types.LeadDTO[] = [
    {
      id: "1",
      firstName: "John",
      lastName: "Doe",
      company: "Tech Corp",
      activities: [
        {
          id: "1",
          type: "EMAIL" as types.ActivityType,
          description: "Follow-up email sent to John Doe",
          createdAt: new Date("2024-01-15"),
        },
      ],
      email: "john.doe@example.com",
      phone: "+1234567890",
      status: "NEW" as types.LeadStatus,
      country: "USA",
    },
    {
      id: "2",
      firstName: "Jane",
      lastName: "Smith",
      company: "Design Studio",
      activities: [
        {
          id: "2",
          type: "CALL" as types.ActivityType,
          description: "Initial contact call completed",
          createdAt: new Date("2024-01-14"),
        },
      ],
      email: "jane.smith@example.com",
      phone: "+1234567890",
      status: "NEW" as types.LeadStatus,
      country: "USA",
    },
  ];

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
            <LastActivityCard leads={mockLeads} />
          </div>
          {/* <DataTable data={data} /> */}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
