import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { types } from "@eleads/shared";

interface LastActivityCardProps {
  leads: types.LeadDTO[];
}

const LastActivityCard = ({ leads }: LastActivityCardProps) => {
  // Get all activities from all leads and sort by date (newest first)
  const activities = leads
    .flatMap(
      (lead) =>
        lead.activities?.map((activity) => ({
          ...activity,
          leadName: `${lead.firstName} ${lead.lastName}`,
          leadCompany: lead.company,
        })) || []
    )
    .sort((a, b) => {
      // Sort by createdAt date, newest first
      if (!a.createdAt || !b.createdAt) return 0;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
        <CardDescription>Latest lead interactions across your team</CardDescription>
      </CardHeader>
      <CardContent>
        {activities.length > 0 ? (
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">{activity?.type}</span> - {activity?.leadName}
                    {activity?.leadCompany && ` (${activity?.leadCompany})`}
                  </p>
                  <p className="text-xs text-muted-foreground">{activity?.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {activity?.createdAt
                      ? new Date(activity.createdAt).toLocaleString()
                      : "No date"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center mb-3">
              <svg
                className="h-6 w-6 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-1">No recent activities</p>
            <p className="text-xs text-muted-foreground">
              Activities will appear here when you interact with leads
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LastActivityCard;
