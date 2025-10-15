import { useState, useEffect } from "react";
import { Users, UserCheck, UserX, Star } from "lucide-react";
import StatsCards from "@/components/core/StatsCards";
import { ClientsTable, ClientsActionBar } from "@/components/core/Clients";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { showSuccessToast, showErrorToast } from "@/utils/toast";
import { types } from "@eleads/shared";
import { useWorkspaceStore } from "@/stores/workspaceStore";
import { clientsService } from "@/services";

const ClientsPage = () => {
  const workspaceClients = useWorkspaceStore((state) => state.workspaceClients);
  const setWorkspaceClients = useWorkspaceStore((state) => state.setWorkspaceClients);
  const [clients, setClients] = useState<types.ClientDTO[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);

  useEffect(() => {
    setClients(workspaceClients);
  }, [workspaceClients]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, priorityFilter]);

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      (client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.company.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "ALL" || client.status === statusFilter) &&
      (priorityFilter === "ALL" || client.priority === priorityFilter);
    return matchesSearch;
  });

  const handleCreateClient = async (clientData: types.ClientDTO) => {
    setIsCreating(true);

    try {
      // Call the API to create the client
      const response = await clientsService.createClient(clientData);

      if (response.success) {
        showSuccessToast("Client created successfully!");

        // Add the new client to the workspace store
        const newClient = response.data as types.ClientDTO;
        const updatedClients = [...workspaceClients, newClient];
        setWorkspaceClients(updatedClients);
      } else {
        showErrorToast("Failed to create client. Please try again.");
      }
    } catch (error) {
      console.error("Error creating client:", error);
      showErrorToast("An error occurred while creating the client. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateClient = async (clientData: types.ClientDTO) => {
    try {
      // Call the API to update the client
      const response = await clientsService.updateClient(clientData);

      if (response.success) {
        showSuccessToast("Client updated successfully!");

        // Update the client in the workspace store
        const updatedClient = response.data as types.ClientDTO;
        const updatedClients = workspaceClients.map((client) =>
          client.id === updatedClient.id ? updatedClient : client
        );
        setWorkspaceClients(updatedClients);
      } else {
        showErrorToast("Failed to update client. Please try again.");
      }
    } catch (error) {
      console.error("Error updating client:", error);
      showErrorToast("An error occurred while updating the client. Please try again.");
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    setIsDeleting(true);

    try {
      // Call the API to delete the client
      const response = await clientsService.deleteClient(clientId);

      if (response.success) {
        showSuccessToast("Client deleted successfully!");

        // Remove the client from the workspace store
        const updatedClients = workspaceClients.filter((client) => client.id !== clientId);
        setWorkspaceClients(updatedClients);
      } else {
        showErrorToast("Failed to delete client. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting client:", error);
      showErrorToast("An error occurred while deleting the client. Please try again.");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setClientToDelete(null);
    }
  };

  const handleDeleteClick = (clientId: string) => {
    setClientToDelete(clientId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (clientToDelete) {
      handleDeleteClient(clientToDelete);
    }
  };

  // Calculate stats
  const totalClients = filteredClients.length;
  const activeClients = filteredClients.filter(
    (client) => client.status === types.ClientStatus.ACTIVE
  ).length;
  const inactiveClients = filteredClients.filter(
    (client) => client.status === types.ClientStatus.INACTIVE
  ).length;
  const vipClients = filteredClients.filter(
    (client) => client.priority === types.ClientPriority.VIP
  ).length;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Clients</h1>
          <p className="text-muted-foreground">Manage your client relationships and information</p>
        </div>

        {/* Stats Cards */}
        <StatsCards
          cards={[
            {
              title: "Total Clients",
              value: totalClients,
              description: "All registered clients",
              icon: Users,
            },
            {
              title: "Active Clients",
              value: activeClients,
              description: "Currently active clients",
              icon: UserCheck,
              valueColor: "text-emerald-700",
            },
            {
              title: "Inactive Clients",
              value: inactiveClients,
              description: "Inactive client accounts",
              icon: UserX,
              valueColor: "text-gray-600",
            },
            {
              title: "VIP Clients",
              value: vipClients,
              description: "High priority clients",
              icon: Star,
              valueColor: "text-purple-700",
            },
          ]}
        />

        {/* Clients Action Bar */}
        <ClientsActionBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          onCreateClient={handleCreateClient}
          isCreating={isCreating}
        />

        {/* Clients Table Component */}
        <ClientsTable
          clients={filteredClients}
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          priorityFilter={priorityFilter}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onPageSizeChange={(newPageSize) => {
            setItemsPerPage(newPageSize);
            setCurrentPage(1); // Reset to first page when changing page size
          }}
          onEditClient={handleUpdateClient}
          onDeleteClient={handleDeleteClick}
        />

        {/* Delete Confirmation Dialog */}
        <ConfirmationDialog
          isOpen={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          title="Delete Client"
          description="Are you sure you want to delete this client? This action cannot be undone."
          confirmText="Delete"
          onConfirm={handleDeleteConfirm}
          isLoading={isDeleting}
        />
      </div>
    </div>
  );
};

export default ClientsPage;
