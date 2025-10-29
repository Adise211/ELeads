import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AppTable, type TableColumn, type TablePaginationProps } from "@/components/ui/app-table";
import { Users, Building2, Phone, Mail, Globe, FileText, Edit, Trash2 } from "lucide-react";
import { types, schemas } from "@eleads/shared";
import ProtectedUI from "@/components/providers/ProtectedUI";
import ClientDialog from "./ClientDialog";
import ClientDetailsDialog from "./ClientDetailsDialog";
import { useState } from "react";

const statusColors = {
  ACTIVE: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300",
  INACTIVE: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  PROSPECT: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
};

const priorityColors = {
  LOW: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  MEDIUM: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  HIGH: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  VIP: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
};

const DEFAULT_CLIENT: types.ClientDTO = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  country: "",
  company: "",
  industry: "",
  website: "",
  status: types.ClientStatus.PROSPECT,
  priority: types.ClientPriority.MEDIUM,
  workspaceId: "",
  leadId: "",
  assignedToId: "",
};

// Function to normalize client data to ensure all fields have proper values
const normalizeClientData = (client: types.ClientDTO): types.ClientDTO => {
  return {
    ...DEFAULT_CLIENT,
    ...client,
    name: client.name || "",
    email: client.email || "",
    phone: client.phone || "",
    address: client.address || "",
    city: client.city || "",
    state: client.state || "",
    zipCode: client.zipCode || "",
    country: client.country || "",
    company: client.company || "",
    industry: client.industry || "",
    website: client.website || "",
    status: client.status || types.ClientStatus.PROSPECT,
    priority: client.priority || types.ClientPriority.MEDIUM,
    workspaceId: client.workspaceId || "",
    leadId: client.leadId || "",
    assignedToId: client.assignedToId || "",
  };
};

interface ClientsTableProps {
  clients: types.ClientDTO[];
  searchTerm: string;
  statusFilter: string;
  priorityFilter: string;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onEditClient?: (clientData: types.ClientDTO) => void;
  onDeleteClient?: (clientId: string) => void;
}

const ClientsTable = ({
  clients,
  searchTerm,
  statusFilter,
  priorityFilter,
  currentPage,
  itemsPerPage,
  onPageChange,
  onPageSizeChange,
  onEditClient,
  onDeleteClient,
}: ClientsTableProps) => {
  const [selectedClient, setSelectedClient] = useState<types.ClientDTO | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editClientData, setEditClientData] = useState<types.ClientDTO>({ ...DEFAULT_CLIENT });
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});

  const handleViewClient = (client: types.ClientDTO) => {
    setSelectedClient(client);
    setIsViewDialogOpen(true);
  };

  const handleCloseViewDialog = () => {
    setIsViewDialogOpen(false);
    setSelectedClient(null);
  };

  const handleEditClient = (client: types.ClientDTO) => {
    const normalizedClient = normalizeClientData(client);
    setEditClientData(normalizedClient);
    setIsEditDialogOpen(true);
    setEditErrors({});
  };

  const handleUpdateClient = () => {
    // Reset errors
    setEditErrors({});
    const validationResult = schemas.updateClientSchema.safeParse(editClientData);
    if (!validationResult.success) {
      validationResult.error.issues.forEach((issue) => {
        setEditErrors((prev) => ({ ...prev, [issue.path.join(".")]: issue.message }));
      });
      return;
    } else {
      // Call the parent handler with the client data
      if (onEditClient) {
        onEditClient(editClientData);
      }

      // Reset form and close dialog
      setEditClientData({ ...DEFAULT_CLIENT });
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteClient = (clientId: string) => {
    if (onDeleteClient) {
      onDeleteClient(clientId);
    }
  };

  // Filter clients based on search and filters
  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || client.status === statusFilter;
    const matchesPriority = priorityFilter === "ALL" || client.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const columns: TableColumn<types.ClientDTO>[] = [
    {
      key: "client",
      header: "Client",
      render: (client: types.ClientDTO) => (
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-gray-600" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium text-gray-900 truncate">{client.name || "N/A"}</p>
              <Badge variant="secondary" className={`text-xs ${priorityColors[client.priority]}`}>
                {client.priority}
              </Badge>
            </div>
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <Building2 className="w-3 h-3" />
              <span className="truncate">{client.company}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "contact",
      header: "Contact",
      render: (client: types.ClientDTO) => (
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-sm">
            <Mail className="w-3 h-3 text-gray-400" />
            <span className="text-gray-900 truncate">{client.email || "N/A"}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Phone className="w-3 h-3 text-gray-400" />
            <span className="text-gray-500 truncate">{client.phone || "N/A"}</span>
          </div>
        </div>
      ),
    },
    {
      key: "location",
      header: "Location",
      render: (client: types.ClientDTO) =>
        client.city || client.state || client.country ? (
          <div className="space-y-1">
            {client.city && client.state && (
              <div className="text-sm text-gray-900">
                {client.city}, {client.state}
              </div>
            )}
            {client.country && <div className="text-sm text-gray-500">{client.country}</div>}
          </div>
        ) : (
          <span className="text-sm text-gray-400">N/A</span>
        ),
    },
    {
      key: "industry",
      header: "Industry",
      render: (client: types.ClientDTO) =>
        client.industry ? (
          <div className="text-sm text-gray-900">{client.industry}</div>
        ) : (
          <span className="text-sm text-gray-400">N/A</span>
        ),
    },
    {
      key: "status",
      header: "Status",
      render: (client: types.ClientDTO) =>
        client.status ? (
          <Badge variant="secondary" className={`text-xs ${statusColors[client.status]}`}>
            {client.status}
          </Badge>
        ) : (
          <span className="text-sm text-gray-400">N/A</span>
        ),
    },
    {
      key: "website",
      header: "Website",
      render: (client: types.ClientDTO) => (
        <div className="flex items-center space-x-2">
          {client.website ? (
            <a
              href={
                client.website.startsWith("http") ? client.website : `https://${client.website}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800"
            >
              <Globe className="w-3 h-3" />
              <span className="truncate">Visit</span>
            </a>
          ) : (
            <span className="text-sm text-gray-400">N/A</span>
          )}
        </div>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (client: types.ClientDTO) => (
        <div className="flex items-end justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleViewClient(client)}
            title="View client details"
          >
            <FileText className="h-4 w-4" />
          </Button>
          <ProtectedUI allowedRoles={[types.UserRole.ADMIN, types.UserRole.MANAGER]}>
            <Button variant="outline" size="sm" onClick={() => handleEditClient(client)}>
              <Edit className="h-4 w-4" />
            </Button>
          </ProtectedUI>
          <ProtectedUI allowedRoles={[types.UserRole.ADMIN]}>
            {onDeleteClient && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDeleteClient(client.id || "")}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </ProtectedUI>
        </div>
      ),
    },
  ];

  const paginationProps: TablePaginationProps = {
    currentPage,
    totalPages: Math.ceil(filteredClients.length / itemsPerPage),
    itemsPerPage,
    totalItems: filteredClients.length,
    onPageChange,
    onPageSizeChange,
    pageSizeOptions: [5, 10, 20, 50],
  };

  return (
    <div className="space-y-4">
      {/* Table */}
      <AppTable
        data={filteredClients}
        columns={columns}
        getItemId={(client) => client.id || ""}
        pagination={paginationProps}
        emptyState={
          <div className="flex flex-col items-center justify-center text-muted-foreground py-8">
            <p className="text-lg font-medium">No clients found</p>
            <p className="text-sm">Try adjusting your search or filter criteria to find clients.</p>
          </div>
        }
      />

      {/* View Client Dialog */}
      {selectedClient && (
        <ClientDetailsDialog
          client={selectedClient}
          isOpen={isViewDialogOpen}
          onClose={handleCloseViewDialog}
        />
      )}

      {/* Edit Client Dialog */}
      <ClientDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        client={editClientData}
        onClientChange={setEditClientData}
        onSubmit={handleUpdateClient}
        errors={editErrors}
        isEditMode={true}
      />
    </div>
  );
};

export default ClientsTable;
