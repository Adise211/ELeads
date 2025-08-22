import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  StickyNote,
  Edit,
  Trash2,
  Mail,
  Phone,
  Building,
  MoreHorizontal,
  Activity,
} from "lucide-react";
import LeadDetailsDialog from "./LeadDetailsDialog";
import { NoteItem } from "./LeadNotes";
import { types } from "@eleads/shared";
import { useState, useMemo } from "react";
import ProtectedUI from "@/components/providers/ProtectedUI";
import { useWorkspaceStore } from "@/stores/workspaceStore";
import { AppTable, type TableColumn, type TablePaginationProps } from "@/components/ui/app-table";

interface LeadsTableProps {
  filteredLeads: types.LeadDTO[];
  expandedNotes: string | null;
  expandedActivities: string | null;
  getStatusColor: (status: types.LeadStatus) => string;
  openEditDialog: (lead: types.LeadDTO) => void;
  openCreateNoteDialog: (lead: types.LeadDTO) => void;
  openCreateActivityDialog: (lead: types.LeadDTO) => void;
  openEditActivityDialog: (activity: types.ActivityDTO) => void;
  handleDeleteLead: (leadId: string) => void;
  handleDeleteActivity: (activityId: string) => void;
  toggleNotes: (leadId: string) => void;
  toggleActivities: (leadId: string) => void;
  handleEditNote: (noteId: string, content: string) => void;
  handleDeleteNote: (noteId: string) => void;
}

const LeadsTable = ({
  filteredLeads,
  expandedNotes,
  expandedActivities,
  getStatusColor,
  openEditDialog,
  openCreateNoteDialog,
  openCreateActivityDialog,
  openEditActivityDialog,
  handleDeleteLead,
  handleDeleteActivity,
  toggleNotes,
  toggleActivities,
  handleEditNote,
  handleDeleteNote,
}: LeadsTableProps) => {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const workspaceUsers = useWorkspaceStore((state) => state.workspaceUsers);

  // Calculate pagination
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);

  // Reset to first page when filtered leads change
  useMemo(() => {
    setCurrentPage(1);
  }, [filteredLeads.length]);

  const getUserName = (userId: string) => {
    const user = workspaceUsers.find((user) => user.id === userId);
    return user?.firstName + " " + user?.lastName;
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(filteredLeads.map((lead) => lead.id || "")));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (leadId: string, checked: boolean) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(leadId);
    } else {
      newSelected.delete(leadId);
    }
    setSelectedRows(newSelected);
  };

  // Define table columns
  const columns: TableColumn<types.LeadDTO>[] = [
    {
      key: "name",
      header: "Name",
      render: (lead) => (
        <div className="flex items-center gap-3">
          <div>
            <div className="font-medium">
              {lead.firstName} {lead.lastName}
            </div>
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {lead.email || "N/A"}
            </div>
            {lead.phone && Array.isArray(lead.phone) && lead.phone.length > 0 && (
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {lead.phone[0] || "N/A"}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "company",
      header: "Company",
      render: (lead) => (
        <div>
          <div className="font-medium flex items-center gap-1">
            <Building className="h-3 w-3" />
            {lead.company || "N/A"}
          </div>
          {lead.jobTitle && (
            <div className="text-sm text-muted-foreground">{lead.jobTitle || "N/A"}</div>
          )}
          {lead.industry && (
            <div className="text-xs text-muted-foreground">{lead.industry || "N/A"}</div>
          )}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (lead) => (
        <Badge className={getStatusColor(lead.status)}>
          {lead.status === types.LeadStatus.INPROGRESS ? "IN PROGRESS" : lead.status}
        </Badge>
      ),
    },
    {
      key: "assignedTo",
      header: "Assigned To",
      render: (lead) => getUserName(lead.assignedToId || lead.assignedTo?.id || ""),
    },
    {
      key: "lastActivity",
      header: "Last Activity",
      render: (lead) =>
        lead.activities && lead.activities.length > 0 ? (
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <div className="text-sm">{lead.activities[0].type}</div>
              <div className="text-xs text-muted-foreground">
                {lead.activities[0].createdAt
                  ? new Date(lead.activities[0].createdAt).toLocaleDateString()
                  : "N/A"}
              </div>
            </div>
            {lead.activities.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleActivities(lead.id || "")}
                className="p-1 h-auto"
              >
                <Badge variant="outline" className="text-xs">
                  +{lead.activities.length - 1}
                </Badge>
              </Button>
            )}
          </div>
        ) : (
          <span className="text-muted-foreground">No activity</span>
        ),
    },
    {
      key: "createdAt",
      header: "Created",
      render: (lead) =>
        lead.createdAt
          ? new Date(lead.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "N/A",
    },
    {
      key: "notes",
      header: "Notes",
      render: (lead) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => toggleNotes(lead.id || "")}
          className="p-2"
        >
          <StickyNote className="h-4 w-4" />
          <Badge variant="outline" className="ml-2">
            {lead.notes?.length ? `+${lead.notes?.length}` : 0}
          </Badge>
        </Button>
      ),
    },
    {
      key: "actions",
      header: "",
      width: "w-20",
      render: (lead) => (
        <div className="leads-table-actions flex justify-end gap-2">
          <LeadDetailsDialog
            lead={lead}
            getStatusColor={getStatusColor}
            assignedToUser={getUserName(lead.assignedToId || lead.assignedTo?.id || "")}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <ProtectedUI
                allowedPermissions={[types.Permission.EDIT_WORKSPACE_LEADS] as types.Permission[]}
                itemOwnerId={lead.assignedToId}
              >
                <DropdownMenuItem onClick={() => openEditDialog(lead)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
              </ProtectedUI>
              <DropdownMenuItem onClick={() => openCreateNoteDialog(lead)}>
                <StickyNote className="h-4 w-4 mr-2" />
                Create Note
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openCreateActivityDialog(lead)}>
                <Activity className="h-4 w-4 mr-2" />
                Add Activity
              </DropdownMenuItem>
              <ProtectedUI
                allowedPermissions={[types.Permission.DELETE_WORKSPACE_LEADS] as types.Permission[]}
                itemOwnerId={lead.assignedToId}
              >
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Lead</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete {lead.firstName} {lead.lastName}? This
                        action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteLead(lead.id || "")}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </ProtectedUI>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  // Pagination configuration
  const pagination: TablePaginationProps = {
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems: filteredLeads.length,
    onPageChange: setCurrentPage,
    onPageSizeChange: (newSize) => {
      setItemsPerPage(newSize);
      setCurrentPage(1);
    },
  };

  // Expandable rows configuration
  const expandableRows = {
    expandedItem: expandedNotes || expandedActivities,
    onToggle: (leadId: string) => {
      if (expandedNotes === leadId) {
        toggleNotes(leadId);
      } else if (expandedActivities === leadId) {
        toggleActivities(leadId);
      } else {
        toggleNotes(leadId);
      }
    },
    renderExpandedContent: (lead: types.LeadDTO) => {
      // Show activities if expanded from activities, otherwise show notes
      const isExpandedForActivities = expandedActivities === lead.id;

      if (isExpandedForActivities) {
        return (
          <div className="max-w-full overflow-hidden leads-table-expanded-content">
            <div>
              <h4 className="font-medium mb-3">
                All Activities for {lead.firstName} {lead.lastName}
              </h4>
              <div className="space-y-3 max-w-full">
                {lead.activities?.map((activity) => (
                  <div key={activity.id} className="border rounded-lg p-3 bg-muted/50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Activity className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium text-sm">{activity.type}</span>
                          <span className="text-xs text-muted-foreground">
                            {activity.createdAt
                              ? new Date(activity.createdAt).toLocaleDateString()
                              : "N/A"}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditActivityDialog(activity)}
                          className="h-6 w-6 p-0"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Activity</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this activity? This action cannot be
                                undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteActivity(activity.id || "")}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                ))}
                {(!lead.activities || lead.activities.length === 0) && (
                  <p className="text-sm text-muted-foreground">No activities yet.</p>
                )}
              </div>
            </div>
          </div>
        );
      } else {
        return (
          <div className="max-w-full overflow-hidden leads-table-expanded-content">
            <div>
              <h4 className="font-medium mb-3">
                Notes for {lead.firstName} {lead.lastName}
              </h4>
              <div className="space-y-3 max-w-full">
                {lead.notes?.map((note) => (
                  <NoteItem
                    key={note.id}
                    note={note}
                    leadName={`${lead.firstName} ${lead.lastName}`}
                    onEdit={handleEditNote}
                    onDelete={handleDeleteNote}
                  />
                ))}
                {(!lead.notes || lead.notes.length === 0) && (
                  <p className="text-sm text-muted-foreground">No notes yet.</p>
                )}
              </div>
            </div>
          </div>
        );
      }
    },
  };

  return (
    <AppTable
      className="leads-table"
      data={filteredLeads}
      columns={columns}
      title="All Leads"
      description="View and manage your lead pipeline"
      pagination={pagination}
      selectable={true}
      selectedItems={selectedRows}
      onSelectAll={handleSelectAll}
      onSelectItem={handleSelectRow}
      getItemId={(lead) => lead.id || ""}
      expandableRows={expandableRows}
      emptyState={
        <div className="flex flex-col items-center justify-center text-muted-foreground py-8">
          <p className="text-lg font-medium">No leads found</p>
        </div>
      }
    />
  );
};

export default LeadsTable;
