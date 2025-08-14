import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { StickyNote, Edit, Trash2, Mail, Phone, Building, MoreHorizontal } from "lucide-react";
import LeadDetailsDialog from "./LeadDetailsDialog";
import { types } from "@eleads/shared";
import { useState } from "react";
import ProtectedUI from "@/components/providers/ProtectedUI";
import { useWorkspaceStore } from "@/stores/workspaceStore";

interface LeadsTableProps {
  leads: types.LeadDTO[];
  filteredLeads: types.LeadDTO[];
  expandedNotes: string | null;
  getStatusColor: (status: types.LeadStatus) => string;
  openEditDialog: (lead: types.LeadDTO) => void;
  openCreateNoteDialog: (lead: types.LeadDTO) => void;
  handleDeleteLead: (leadId: string) => void;
  toggleNotes: (leadId: string) => void;
}

const LeadsTable = ({
  leads,
  filteredLeads,
  expandedNotes,
  getStatusColor,
  openEditDialog,
  openCreateNoteDialog,
  handleDeleteLead,
  toggleNotes,
}: LeadsTableProps) => {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const workspaceUsers = useWorkspaceStore((state) => state.workspaceUsers);

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

  const isAllSelected = filteredLeads.length > 0 && selectedRows.size === filteredLeads.length;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>All Leads</CardTitle>
          <CardDescription>View and manage your lead pipeline</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-muted-foreground">
              Showing {filteredLeads.length} of {leads.length} leads
            </div>
            {selectedRows.size > 0 && (
              <div className="text-sm text-muted-foreground">
                {selectedRows.size} lead{selectedRows.size !== 1 ? "s" : ""} selected
              </div>
            )}
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={isAllSelected || selectedRows.size > 0}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="text-center"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <p className="text-lg font-medium">No leads found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLeads.map((lead) => (
                    <>
                      <TableRow key={lead.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedRows.has(lead.id || "")}
                            onCheckedChange={(checked: boolean) =>
                              handleSelectRow(lead.id || "", checked)
                            }
                            aria-label={`Select ${lead.firstName} ${lead.lastName}`}
                          />
                        </TableCell>
                        <TableCell className="font-medium">
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
                        </TableCell>
                        <TableCell>
                          {" "}
                          <div>
                            <div className="font-medium flex items-center gap-1">
                              <Building className="h-3 w-3" />
                              {lead.company || "N/A"}
                            </div>
                            {lead.jobTitle && (
                              <div className="text-sm text-muted-foreground">
                                {lead.jobTitle || "N/A"}
                              </div>
                            )}
                            {lead.industry && (
                              <div className="text-xs text-muted-foreground">
                                {lead.industry || "N/A"}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(lead.status)}>
                            {lead.status === types.LeadStatus.INPROGRESS
                              ? "IN PROGRESS"
                              : lead.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {getUserName(lead.assignedToId || lead.assignedTo?.id || "")}
                        </TableCell>
                        <TableCell>
                          {lead.activities && lead.activities.length > 0 ? (
                            <div>
                              <div className="text-sm">{lead.activities[0].type}</div>
                              <div className="text-xs text-muted-foreground">
                                {lead.activities[0].createdAt
                                  ? new Date(lead.activities[0].createdAt).toLocaleDateString()
                                  : "N/A"}
                              </div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">No activity</span>
                          )}{" "}
                        </TableCell>
                        <TableCell>
                          {lead.createdAt
                            ? new Date(lead.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "N/A"}
                        </TableCell>
                        <TableCell>
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
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-end gap-2">
                            {/* Lead Details Dialog */}
                            <LeadDetailsDialog
                              lead={lead}
                              getStatusColor={getStatusColor}
                              assignedToUser={getUserName(
                                lead.assignedToId || lead.assignedTo?.id || ""
                              )}
                            />
                            {/* End Lead Details Dialog */}
                            {/* Dropdown Menu */}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <ProtectedUI
                                  allowedPermissions={
                                    [types.Permission.EDIT_WORKSPACE_LEADS] as types.Permission[]
                                  }
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
                                {/* Delete lead with confirmation dialog */}
                                <ProtectedUI
                                  allowedPermissions={
                                    [types.Permission.DELETE_WORKSPACE_LEADS] as types.Permission[]
                                  }
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
                                          Are you sure you want to delete {lead.firstName}{" "}
                                          {lead.lastName}? This action cannot be undone.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => handleDeleteLead(lead.id || "")}
                                        >
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </ProtectedUI>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                      {expandedNotes === lead.id && lead.notes && lead.notes.length > 0 && (
                        <TableRow>
                          <TableCell colSpan={10} className="bg-muted/50">
                            <div className="py-4">
                              <h4 className="font-medium mb-3">
                                Notes for {lead.firstName} {lead.lastName}
                              </h4>
                              <div className="space-y-3">
                                {lead.notes.map((note) => (
                                  <div key={note.id} className="border-l-4 border-primary pl-4">
                                    <p className="text-sm">{note.content}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {note.createdAt
                                        ? new Date(note.createdAt).toLocaleString()
                                        : "N/A"}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default LeadsTable;
