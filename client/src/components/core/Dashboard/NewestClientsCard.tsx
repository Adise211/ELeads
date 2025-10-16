import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Building2, Mail, Phone, MapPin } from "lucide-react";
import { useWorkspaceStore } from "@/stores/workspaceStore";
import { useUserDataStore } from "@/stores/userDataStore";

interface NewestClientsCardProps {
  isPersonalView: boolean;
}

const statusColors = {
  ACTIVE: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300",
  INACTIVE: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  PROSPECT: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
};

const NewestClientsCard = ({ isPersonalView }: NewestClientsCardProps) => {
  // Workspace data
  const workspaceClients = useWorkspaceStore((state) => state.workspaceClients);

  // User personal data
  const userClients = useUserDataStore((state) => state.userClients);

  // Use appropriate data based on view
  const clients = isPersonalView ? userClients : workspaceClients;

  // Sort clients by createdAt date (newest first) and take the first 5
  const newestClients = clients
    .filter((client) => client.createdAt) // Only include clients with creation date
    .sort((a, b) => {
      if (!a.createdAt || !b.createdAt) return 0;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isPersonalView ? "Your Newest Clients" : "Newest Clients"}</CardTitle>
        <CardDescription>
          {isPersonalView
            ? "Recently added clients assigned to you"
            : "Recently added clients to your workspace"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {newestClients.length > 0 ? (
          <div className="space-y-4">
            {newestClients.map((client, index) => (
              <div
                key={client.id || index}
                className="flex items-start gap-3 p-3 rounded-lg border bg-card"
              >
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-gray-600" />
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{client.name || "N/A"}</p>
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Building2 className="w-3 h-3" />
                        <span>{client.company || "N/A"}</span>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className={`text-xs ${statusColors[client.status] || statusColors.PROSPECT}`}
                    >
                      {client.status}
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    {client.email && (
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <Mail className="w-3 h-3" />
                        <span className="truncate">{client.email}</span>
                      </div>
                    )}
                    {client.phone && (
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <Phone className="w-3 h-3" />
                        <span>{client.phone}</span>
                      </div>
                    )}
                    {(client.city || client.state) && (
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        <span>
                          {client.city && client.state
                            ? `${client.city}, ${client.state}`
                            : client.city || client.state || "N/A"}
                        </span>
                      </div>
                    )}
                  </div>

                  {client.createdAt && (
                    <p className="text-xs text-muted-foreground">
                      Added {new Date(client.createdAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center mb-3">
              <Users className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-1">No clients yet</p>
            <p className="text-xs text-muted-foreground">
              {isPersonalView
                ? "New clients assigned to you will appear here"
                : "New clients will appear here when they are added to your workspace"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NewestClientsCard;
