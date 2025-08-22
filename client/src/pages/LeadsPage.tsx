import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useWorkspaceStore } from "@/stores/workspaceStore";
import { showSuccessToast } from "@/utils/toast";
import { StatsCards, LeadsTable, ActionBar, LeadActivityDialog } from "@/components/core/Leads";
import { industriesList } from "@/components/core/Leads/leads.data";
import { types, schemas } from "@eleads/shared";
import { leadsService } from "@/services";
import sanitizeHtml from "sanitize-html";

const DEFAULT_LEAD: types.LeadDTO = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  company: "",
  status: types.LeadStatus.NEW,
  country: "",
  jobTitle: "",
  industry: "",
  website: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  // notes: [],
  // activities: [],
  assignedToId: "",
  // assignedTo: {} as types.UserDTO,
};

const getStatusColor = (status: types.LeadStatus) => {
  switch (status) {
    case types.LeadStatus.NEW:
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case types.LeadStatus.INPROGRESS:
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case types.LeadStatus.LOST:
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  }
};

const LeadsPage = () => {
  const workspaceLeads = useWorkspaceStore((state) => state.workspaceLeads);
  const [leads, setLeads] = useState<types.LeadDTO[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [industryFilter, setIndustryFilter] = useState("ALL");
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [isEditLeadOpen, setIsEditLeadOpen] = useState(false);
  const [isCreateNoteOpen, setIsCreateNoteOpen] = useState(false);
  const [creatingNoteFor, setCreatingNoteFor] = useState<types.LeadDTO | null>(null);
  const [newNoteContent, setNewNoteContent] = useState("");
  const [isCreateActivityOpen, setIsCreateActivityOpen] = useState(false);
  const [creatingActivityFor, setCreatingActivityFor] = useState<types.LeadDTO | null>(null);
  const [newActivityType, setNewActivityType] = useState<types.ActivityType>(
    types.ActivityType.EMAIL
  );
  const [newActivityDescription, setNewActivityDescription] = useState("");
  const [isEditActivityOpen, setIsEditActivityOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<types.ActivityDTO | null>(null);
  const [editActivityType, setEditActivityType] = useState<types.ActivityType>(
    types.ActivityType.EMAIL
  );
  const [editActivityDescription, setEditActivityDescription] = useState("");
  const [editingLead, setEditingLead] = useState<types.LeadDTO | null>(null);
  const [expandedNotes, setExpandedNotes] = useState<string | null>(null);
  const [expandedActivities, setExpandedActivities] = useState<string | null>(null);
  const [newLead, setNewLead] = useState({ ...DEFAULT_LEAD });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setLeads(workspaceLeads);
  }, [workspaceLeads]);

  // Filter leads based on search and filters
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      `${lead.firstName} ${lead.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || lead.status === statusFilter;
    const matchesIndustry = industryFilter === "ALL" || lead.industry === industryFilter;
    return matchesSearch && matchesStatus && matchesIndustry;
  });

  const totalLeads = filteredLeads.length;
  const newLeads = filteredLeads.filter((lead) => lead.status === types.LeadStatus.NEW).length;
  const inProgressLeads = filteredLeads.filter(
    (lead) => lead.status === types.LeadStatus.INPROGRESS
  ).length;
  const lostLeads = filteredLeads.filter((lead) => lead.status === types.LeadStatus.LOST).length;

  const handleAddLead = async () => {
    const validationResult = schemas.leadSchema.safeParse(newLead);
    if (!validationResult.success) {
      validationResult.error.issues.forEach((issue) => {
        setErrors((prev) => ({ ...prev, [issue.path.join(".")]: issue.message }));
      });
    } else {
      const response = await leadsService.createLead(newLead);

      if (response.success) {
        setLeads([...leads, response.data]);
        showSuccessToast(`${newLead.firstName} ${newLead.lastName} has been added successfully.`);
        setIsAddLeadOpen(false);
        setNewLead({ ...DEFAULT_LEAD });
        setErrors({});
      }
    }
  };

  const handleEditLead = async () => {
    if (!editingLead) return;

    // validate the editing lead
    const validationResult = schemas.leadSchema.safeParse(editingLead);
    if (!validationResult.success) {
      validationResult.error.issues.forEach((issue) => {
        setErrors((prev) => ({ ...prev, [issue.path.join(".")]: issue.message }));
      });
    } else {
      let updatedLeads = leads;
      const response = await leadsService.updateLead(editingLead);
      if (response.success) {
        // update the lead
        const prevLeadIndex = leads.findIndex((lead) => lead.id === editingLead.id);
        if (prevLeadIndex !== -1) {
          updatedLeads = [...leads];
          updatedLeads[prevLeadIndex] = response.data;
        }

        setLeads(updatedLeads);
        showSuccessToast(
          `${editingLead.firstName} ${editingLead.lastName} has been updated successfully.`
        );
        setIsEditLeadOpen(false);
        setEditingLead(null);
      }
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    const leadToDelete = leads.find((lead) => lead.id === leadId);
    const response = await leadsService.deleteLead(leadId, leadToDelete?.assignedToId || "");
    if (response.success) {
      setLeads(leads.filter((lead) => lead.id !== leadId));
      showSuccessToast(`${leadToDelete?.firstName} ${leadToDelete?.lastName} has been deleted.`);
    }
  };

  const openEditDialog = (lead: types.LeadDTO) => {
    setEditingLead({ ...lead, phone: lead.phone });
    setIsEditLeadOpen(true);
  };

  const openCreateNoteDialog = (lead: types.LeadDTO) => {
    setCreatingNoteFor(lead);
    setNewNoteContent("");
    setIsCreateNoteOpen(true);
  };

  const openCreateActivityDialog = (lead: types.LeadDTO) => {
    setCreatingActivityFor(lead);
    setNewActivityType(types.ActivityType.EMAIL);
    setNewActivityDescription("");
    setIsCreateActivityOpen(true);
  };

  const openEditActivityDialog = (activity: types.ActivityDTO) => {
    setEditingActivity(activity);
    setEditActivityType(activity.type);
    setEditActivityDescription(activity.description);
    setIsEditActivityOpen(true);
  };

  const handleEditActivity = async () => {
    if (!editingActivity || !editActivityDescription.trim()) return;

    const sanitizedDescription = sanitizeHtml(editActivityDescription.trim());
    const response = await leadsService.updateActivity(
      editingActivity.id || "",
      editActivityType,
      sanitizedDescription
    );

    if (response.success) {
      // Update the activity in the leads array
      const updatedLeads = leads.map((lead) => ({
        ...lead,
        activities: lead.activities?.map((activity) =>
          activity.id === editingActivity.id
            ? {
                ...activity,
                type: editActivityType,
                description: sanitizedDescription,
                updatedAt: response.data.updatedAt,
              }
            : activity
        ),
      }));

      // Reset
      setLeads(updatedLeads);
      showSuccessToast("Activity updated successfully");
      setIsEditActivityOpen(false);
      setEditingActivity(null);
      setEditActivityType(types.ActivityType.EMAIL);
      setEditActivityDescription("");
    }
  };

  const handleDeleteActivity = async (activityId: string) => {
    const response = await leadsService.deleteActivity(activityId);
    if (response.success) {
      // Remove the activity from the leads array
      const updatedLeads = leads.map((lead) => ({
        ...lead,
        activities: lead.activities?.filter((activity) => activity.id !== activityId),
      }));

      setLeads(updatedLeads);
      showSuccessToast("Activity deleted successfully");
    }
  };

  const handleCreateActivity = async () => {
    // TODO: Add validation for the activity description
    if (!creatingActivityFor || !newActivityDescription.trim()) return;

    const sanitizedDescription = sanitizeHtml(newActivityDescription.trim());
    const response = await leadsService.createActivity(
      creatingActivityFor.id || "",
      newActivityType,
      sanitizedDescription
    );

    if (response.success) {
      // Update the lead with the new activity
      const updatedLeads = leads.map((lead) =>
        lead.id === creatingActivityFor.id
          ? {
              ...lead,
              activities: [...(lead.activities || []), response.data],
              updatedAt: new Date(),
            }
          : lead
      );

      setLeads(updatedLeads);
      showSuccessToast(
        `Activity added to ${creatingActivityFor.firstName} ${creatingActivityFor.lastName}`
      );
      // reset
      setIsCreateActivityOpen(false);
      setCreatingActivityFor(null);
      setNewActivityType(types.ActivityType.EMAIL);
      setNewActivityDescription("");
    }
  };

  const handleCreateNote = async () => {
    if (!creatingNoteFor || !newNoteContent.trim()) return;

    const sanitizedContent = sanitizeHtml(newNoteContent.trim());
    const response = await leadsService.createNote(creatingNoteFor.id || "", sanitizedContent);

    if (response.success) {
      // Update the lead with the new note
      const updatedLeads = leads.map((lead) =>
        lead.id === creatingNoteFor.id
          ? {
              ...lead,
              notes: [...(lead.notes || []), response.data],
              updatedAt: new Date(),
            }
          : lead
      );

      setLeads(updatedLeads);
      showSuccessToast(`Note added to ${creatingNoteFor.firstName} ${creatingNoteFor.lastName}`);
      setIsCreateNoteOpen(false);
      setCreatingNoteFor(null);
      setNewNoteContent("");
    }
  };

  const handleEditNote = async (noteId: string, content: string) => {
    const sanitizedContent = sanitizeHtml(content);
    const response = await leadsService.updateNote(noteId, sanitizedContent);

    if (response.success) {
      // Update the note in the leads array
      const updatedLeads = leads.map((lead) => ({
        ...lead,
        notes: lead.notes?.map((note) =>
          note.id === noteId ? { ...note, content, updatedAt: response.data.updatedAt } : note
        ),
      }));

      setLeads(updatedLeads);
      showSuccessToast("Note updated successfully");
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    const response = await leadsService.deleteNote(noteId);

    if (response.success) {
      // Remove the note from the leads array
      const updatedLeads = leads.map((lead) => ({
        ...lead,
        notes: lead.notes?.filter((note) => note.id !== noteId),
      }));

      setLeads(updatedLeads);
      showSuccessToast("Note deleted successfully");
    }
  };

  const handleExport = () => {
    // Here you would typically generate and download a CSV/Excel file
    showSuccessToast("Your leads data is being exported. Download will start shortly.");
  };

  const toggleNotes = (leadId: string) => {
    setExpandedNotes(expandedNotes === leadId ? null : leadId);
  };

  const toggleActivities = (leadId: string) => {
    setExpandedActivities(expandedActivities === leadId ? null : leadId);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Leads</h1>
          <p className="text-muted-foreground">Manage and track your sales leads</p>
        </div>

        {/* Stats Cards */}
        <StatsCards
          totalLeads={totalLeads}
          newLeads={newLeads}
          inProgressLeads={inProgressLeads}
          lostLeads={lostLeads}
        />

        {/* Action Bar */}
        <ActionBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          industryFilter={industryFilter}
          setIndustryFilter={setIndustryFilter}
          isAddLeadOpen={isAddLeadOpen}
          setIsAddLeadOpen={setIsAddLeadOpen}
          newLead={newLead}
          setNewLead={setNewLead}
          handleAddLead={handleAddLead}
          handleExport={handleExport}
          errors={errors}
        />

        {/* Leads Table */}
        <LeadsTable
          filteredLeads={filteredLeads}
          expandedNotes={expandedNotes}
          expandedActivities={expandedActivities}
          getStatusColor={getStatusColor}
          openEditDialog={openEditDialog}
          openCreateNoteDialog={openCreateNoteDialog}
          openCreateActivityDialog={openCreateActivityDialog}
          openEditActivityDialog={openEditActivityDialog}
          handleDeleteLead={handleDeleteLead}
          handleDeleteActivity={handleDeleteActivity}
          toggleNotes={toggleNotes}
          toggleActivities={toggleActivities}
          handleEditNote={handleEditNote}
          handleDeleteNote={handleDeleteNote}
        />

        {/* Edit Lead Dialog */}
        <Dialog open={isEditLeadOpen} onOpenChange={setIsEditLeadOpen}>
          <DialogContent className="!max-w-[90vw] !w-[50vw] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Lead</DialogTitle>
              <DialogDescription>Update the lead information below.</DialogDescription>
            </DialogHeader>
            {editingLead && (
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="editFirstName">First Name *</Label>
                  <Input
                    id="editFirstName"
                    value={editingLead.firstName}
                    onChange={(e) => setEditingLead({ ...editingLead, firstName: e.target.value })}
                    placeholder="John"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editLastName">Last Name</Label>
                  <Input
                    id="editLastName"
                    value={editingLead.lastName}
                    onChange={(e) => setEditingLead({ ...editingLead, lastName: e.target.value })}
                    placeholder="Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editEmail">Email *</Label>
                  <Input
                    id="editEmail"
                    type="email"
                    value={editingLead.email}
                    onChange={(e) => setEditingLead({ ...editingLead, email: e.target.value })}
                    placeholder="john.doe@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editPhone">Phone</Label>
                  <Input
                    id="editPhone"
                    value={editingLead.phone || ""}
                    onChange={(e) => setEditingLead({ ...editingLead, phone: e.target.value })}
                    placeholder="+1-555-0101"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editCompany">Company</Label>
                  <Input
                    id="editCompany"
                    value={editingLead.company}
                    onChange={(e) => setEditingLead({ ...editingLead, company: e.target.value })}
                    placeholder="TechCorp Inc."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editJobTitle">Job Title</Label>
                  <Input
                    id="editJobTitle"
                    value={editingLead.jobTitle}
                    onChange={(e) => setEditingLead({ ...editingLead, jobTitle: e.target.value })}
                    placeholder="Software Engineer"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editIndustry">Industry</Label>
                  <Select
                    value={editingLead.industry}
                    onValueChange={(value) => setEditingLead({ ...editingLead, industry: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industriesList.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editStatus">Status</Label>
                  <Select
                    value={editingLead.status}
                    onValueChange={(value) =>
                      setEditingLead({ ...editingLead, status: value as types.LeadStatus })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(types.LeadStatus).map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editWebsite">Website</Label>
                  <Input
                    id="editWebsite"
                    value={editingLead.website}
                    onChange={(e) => setEditingLead({ ...editingLead, website: e.target.value })}
                    placeholder="https://example.com"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="editAddress">Address</Label>
                  <Input
                    id="editAddress"
                    value={editingLead.address}
                    onChange={(e) => setEditingLead({ ...editingLead, address: e.target.value })}
                    placeholder="123 Main St"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editCity">City</Label>
                  <Input
                    id="editCity"
                    value={editingLead.city}
                    onChange={(e) => setEditingLead({ ...editingLead, city: e.target.value })}
                    placeholder="San Francisco"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editState">State</Label>
                  <Input
                    id="editState"
                    value={editingLead.state}
                    onChange={(e) => setEditingLead({ ...editingLead, state: e.target.value })}
                    placeholder="CA"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editZipCode">Zip Code</Label>
                  <Input
                    id="editZipCode"
                    value={editingLead.zipCode}
                    onChange={(e) => setEditingLead({ ...editingLead, zipCode: e.target.value })}
                    placeholder="94105"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editCountry">Country</Label>
                  <Input
                    id="editCountry"
                    value={editingLead.country}
                    onChange={(e) => setEditingLead({ ...editingLead, country: e.target.value })}
                    placeholder="USA"
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditLeadOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleEditLead}
                disabled={!editingLead?.firstName || !editingLead?.email}
              >
                Update Lead
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Create Note Dialog */}
        <Dialog open={isCreateNoteOpen} onOpenChange={setIsCreateNoteOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create Note</DialogTitle>
              <DialogDescription>
                Add a note for {creatingNoteFor?.firstName} {creatingNoteFor?.lastName}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="noteContent">Note Content</Label>
                <Textarea
                  id="noteContent"
                  placeholder="Enter your note here..."
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateNoteOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateNote} disabled={!newNoteContent.trim()}>
                Create Note
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Create Activity Dialog */}
        <Dialog open={isCreateActivityOpen} onOpenChange={setIsCreateActivityOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create Activity</DialogTitle>
              <DialogDescription>
                Add an activity for {creatingActivityFor?.firstName} {creatingActivityFor?.lastName}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="activityType">Activity Type</Label>
                <Select
                  value={newActivityType}
                  onValueChange={(value) => setNewActivityType(value as types.ActivityType)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select activity type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(types.ActivityType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="activityDescription">Description</Label>
                <Textarea
                  id="activityDescription"
                  placeholder="Enter activity description..."
                  value={newActivityDescription}
                  onChange={(e) => setNewActivityDescription(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateActivityOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateActivity} disabled={!newActivityDescription.trim()}>
                Create Activity
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Activity Dialog */}
        <LeadActivityDialog
          isOpen={isEditActivityOpen}
          onOpenChange={setIsEditActivityOpen}
          activity={editingActivity}
          activityType={editActivityType}
          activityDescription={editActivityDescription}
          onActivityTypeChange={setEditActivityType}
          onActivityDescriptionChange={setEditActivityDescription}
          onSave={handleEditActivity}
        />
      </div>
    </div>
  );
};

export default LeadsPage;
