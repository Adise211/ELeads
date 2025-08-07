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
import { showSuccessToast } from "@/utils/toast";
import { StatsCards, LeadsTable, ActionBar } from "@/components/core/Leads";
import type { LeadDTO } from "@eleads/shared";
import { LeadStatus } from "@eleads/shared";
import { useWorkspaceStore } from "@/stores/workspaceStore";

// Mock data based on the schema
// const mockLeads: LeadDTO[] = [
//   {
//     id: "lead_1",
//     firstName: "John",
//     lastName: "Doe",
//     email: "john.doe@example.com",
//     phone: ["+1-555-0101"],
//     company: "TechCorp Inc.",
//     jobTitle: "Software Engineer",
//     industry: "Technology",
//     status: LeadStatus.NEW,
//     website: "https://techcorp.com",
//     address: "123 Main St",
//     city: "San Francisco",
//     state: "CA",
//     zipCode: "94105",
//     country: "USA",
//     createdAt: new Date("2024-01-15T10:30:00Z"),
//     updatedAt: new Date("2024-01-15T10:30:00Z"),
//     notes: [
//       {
//         id: "note_1",
//         content: "Initial contact via LinkedIn",
//         createdAt: new Date("2024-01-15T10:30:00Z"),
//         leadId: "lead_1",
//         lead: {} as LeadDTO,
//       },
//       {
//         id: "note_2",
//         content: "Interested in our enterprise solution",
//         createdAt: new Date("2024-01-16T14:20:00Z"),
//         leadId: "lead_1",
//         lead: {} as LeadDTO,
//       },
//     ],
//     activities: [],
//   },
//   {
//     id: "lead_2",
//     firstName: "Jane",
//     lastName: "Smith",
//     email: "jane.smith@example.com",
//     phone: ["+1-555-0102"],
//     company: "Marketing Pro",
//     jobTitle: "Marketing Director",
//     industry: "Marketing",
//     status: LeadStatus.INPROGRESS,
//     website: "https://marketingpro.com",
//     address: "456 Oak Ave",
//     city: "New York",
//     state: "NY",
//     zipCode: "10001",
//     country: "USA",
//     createdAt: new Date("2024-01-14T09:15:00Z"),
//     updatedAt: new Date("2024-01-16T14:20:00Z"),
//     notes: [
//       {
//         id: "note_3",
//         content: "Follow up scheduled for next week",
//         createdAt: new Date("2024-01-16T14:20:00Z"),
//         leadId: "lead_2",
//         lead: {} as LeadDTO,
//       },
//     ],
//     activities: [],
//   },
//   {
//     id: "lead_3",
//     firstName: "Mike",
//     lastName: "Johnson",
//     email: "mike.johnson@example.com",
//     phone: ["+1-555-0103", "+1-555-0104"],
//     company: "StartupXYZ",
//     jobTitle: "CEO",
//     industry: "SaaS",
//     status: LeadStatus.LOST,
//     website: "https://startupxyz.com",
//     address: "789 Pine St",
//     city: "Austin",
//     state: "TX",
//     zipCode: "73301",
//     country: "USA",
//     createdAt: new Date("2024-01-13T16:45:00Z"),
//     updatedAt: new Date("2024-01-17T11:30:00Z"),
//     notes: [
//       {
//         id: "note_4",
//         content: "Very interested, ready to move forward",
//         createdAt: new Date("2024-01-17T11:30:00Z"),
//         leadId: "lead_3",
//         lead: {} as LeadDTO,
//       },
//       {
//         id: "note_5",
//         content: "Budget approved for Q1",
//         createdAt: new Date("2024-01-17T15:45:00Z"),
//         leadId: "lead_3",
//         lead: {} as LeadDTO,
//       },
//     ],
//     activities: [],
//   },
// ];

const getStatusColor = (status: LeadStatus) => {
  switch (status) {
    case LeadStatus.NEW:
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case LeadStatus.INPROGRESS:
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case LeadStatus.LOST:
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  }
};

const LeadsPage = () => {
  const workspaceLeads = useWorkspaceStore((state) => state.workspaceLeads);
  const [leads, setLeads] = useState<LeadDTO[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [industryFilter, setIndustryFilter] = useState("ALL");
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [isEditLeadOpen, setIsEditLeadOpen] = useState(false);
  const [isCreateNoteOpen, setIsCreateNoteOpen] = useState(false);
  const [creatingNoteFor, setCreatingNoteFor] = useState<LeadDTO | null>(null);
  const [newNoteContent, setNewNoteContent] = useState("");
  const [editingLead, setEditingLead] = useState<LeadDTO | null>(null);
  const [expandedNotes, setExpandedNotes] = useState<string | null>(null);
  const [newLead, setNewLead] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    jobTitle: "",
    industry: "",
    website: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

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
  const newLeads = filteredLeads.filter((lead) => lead.status === LeadStatus.NEW).length;
  const inProgressLeads = filteredLeads.filter(
    (lead) => lead.status === LeadStatus.INPROGRESS
  ).length;
  const lostLeads = filteredLeads.filter((lead) => lead.status === LeadStatus.LOST).length;

  const handleAddLead = () => {
    const newLeadData: LeadDTO = {
      ...newLead,
      id: `lead_${Date.now()}`,
      status: LeadStatus.NEW,
      createdAt: new Date(),
      updatedAt: new Date(),
      phone: newLead.phone ? [newLead.phone] : [],
      notes: [],
      activities: [],
    };
    setLeads([...leads, newLeadData]);
    showSuccessToast(`${newLead.firstName} ${newLead.lastName} has been added successfully.`);
    setIsAddLeadOpen(false);
    setNewLead({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      jobTitle: "",
      industry: "",
      website: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    });
  };

  const handleEditLead = () => {
    if (!editingLead) return;

    const updatedLeads: LeadDTO[] = leads.map((lead) =>
      lead.id === editingLead.id ? { ...editingLead, updatedAt: new Date() } : lead
    );
    setLeads(updatedLeads);
    showSuccessToast(
      `${editingLead.firstName} ${editingLead.lastName} has been updated successfully.`
    );
    setIsEditLeadOpen(false);
    setEditingLead(null);
  };

  const handleDeleteLead = (leadId: string) => {
    const leadToDelete = leads.find((lead) => lead.id === leadId);
    setLeads(leads.filter((lead) => lead.id !== leadId));
    showSuccessToast(`${leadToDelete?.firstName} ${leadToDelete?.lastName} has been deleted.`);
  };

  const openEditDialog = (lead: LeadDTO) => {
    setEditingLead({ ...lead, phone: lead.phone });
    setIsEditLeadOpen(true);
  };

  const openCreateNoteDialog = (lead: LeadDTO) => {
    setCreatingNoteFor(lead);
    setNewNoteContent("");
    setIsCreateNoteOpen(true);
  };

  const handleCreateNote = () => {
    if (!creatingNoteFor || !newNoteContent.trim()) return;

    const newNote = {
      id: `note_${Date.now()}`,
      content: newNoteContent.trim(),
      createdAt: new Date(),
      leadId: creatingNoteFor.id || "",
      lead: {} as LeadDTO,
    };

    const updatedLeads = leads.map((lead) =>
      lead.id === creatingNoteFor.id
        ? {
            ...lead,
            notes: [...(lead.notes || []), newNote],
            updatedAt: new Date(),
          }
        : lead
    );

    setLeads(updatedLeads);
    showSuccessToast(`Note added to ${creatingNoteFor.firstName} ${creatingNoteFor.lastName}`);
    setIsCreateNoteOpen(false);
    setCreatingNoteFor(null);
    setNewNoteContent("");
  };

  const handleExport = () => {
    // Here you would typically generate and download a CSV/Excel file
    showSuccessToast("Your leads data is being exported. Download will start shortly.");
  };

  const toggleNotes = (leadId: string) => {
    setExpandedNotes(expandedNotes === leadId ? null : leadId);
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
        />

        {/* Leads Table */}
        <LeadsTable
          leads={leads}
          filteredLeads={filteredLeads}
          expandedNotes={expandedNotes}
          getStatusColor={getStatusColor}
          openEditDialog={openEditDialog}
          openCreateNoteDialog={openCreateNoteDialog}
          handleDeleteLead={handleDeleteLead}
          toggleNotes={toggleNotes}
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
                    value={editingLead.phone[0] || ""}
                    onChange={(e) => setEditingLead({ ...editingLead, phone: [e.target.value] })}
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
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="SaaS">SaaS</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Healthcare">Healthcare</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editStatus">Status</Label>
                  <Select
                    value={editingLead.status}
                    onValueChange={(value) =>
                      setEditingLead({ ...editingLead, status: value as LeadStatus })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={LeadStatus.NEW}>New</SelectItem>
                      <SelectItem value={LeadStatus.INPROGRESS}>In Progress</SelectItem>
                      <SelectItem value={LeadStatus.LOST}>Lost</SelectItem>
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
      </div>
    </div>
  );
};

export default LeadsPage;
