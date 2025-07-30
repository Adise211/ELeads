import { useState } from "react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
import {
  Users,
  UserPlus,
  TrendingUp,
  Clock,
  Search,
  Filter,
  Download,
  Plus,
  StickyNote,
  Edit,
  Trash2,
} from "lucide-react";
import { showSuccessToast } from "@/utils/toast";
import type { LeadDTO } from "../../../shared/types/index";
import { LeadStatus } from "../../../shared/types/prisma-enums";

// Mock data based on the schema
const mockLeads: LeadDTO[] = [
  {
    id: "lead_1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: ["+1-555-0101"],
    company: "TechCorp Inc.",
    jobTitle: "Software Engineer",
    industry: "Technology",
    status: LeadStatus.NEW,
    website: "https://techcorp.com",
    address: "123 Main St",
    city: "San Francisco",
    state: "CA",
    zipCode: "94105",
    country: "USA",
    createdAt: new Date("2024-01-15T10:30:00Z"),
    updatedAt: new Date("2024-01-15T10:30:00Z"),
    notes: [
      {
        id: "note_1",
        content: "Initial contact via LinkedIn",
        createdAt: new Date("2024-01-15T10:30:00Z"),
        leadId: "lead_1",
        lead: {} as LeadDTO,
      },
      {
        id: "note_2",
        content: "Interested in our enterprise solution",
        createdAt: new Date("2024-01-16T14:20:00Z"),
        leadId: "lead_1",
        lead: {} as LeadDTO,
      },
    ],
    activities: [],
  },
  {
    id: "lead_2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    phone: ["+1-555-0102"],
    company: "Marketing Pro",
    jobTitle: "Marketing Director",
    industry: "Marketing",
    status: LeadStatus.INPROGRESS,
    website: "https://marketingpro.com",
    address: "456 Oak Ave",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "USA",
    createdAt: new Date("2024-01-14T09:15:00Z"),
    updatedAt: new Date("2024-01-16T14:20:00Z"),
    notes: [
      {
        id: "note_3",
        content: "Follow up scheduled for next week",
        createdAt: new Date("2024-01-16T14:20:00Z"),
        leadId: "lead_2",
        lead: {} as LeadDTO,
      },
    ],
    activities: [],
  },
  {
    id: "lead_3",
    firstName: "Mike",
    lastName: "Johnson",
    email: "mike.johnson@example.com",
    phone: ["+1-555-0103", "+1-555-0104"],
    company: "StartupXYZ",
    jobTitle: "CEO",
    industry: "SaaS",
    status: LeadStatus.LOST,
    website: "https://startupxyz.com",
    address: "789 Pine St",
    city: "Austin",
    state: "TX",
    zipCode: "73301",
    country: "USA",
    createdAt: new Date("2024-01-13T16:45:00Z"),
    updatedAt: new Date("2024-01-17T11:30:00Z"),
    notes: [
      {
        id: "note_4",
        content: "Very interested, ready to move forward",
        createdAt: new Date("2024-01-17T11:30:00Z"),
        leadId: "lead_3",
        lead: {} as LeadDTO,
      },
      {
        id: "note_5",
        content: "Budget approved for Q1",
        createdAt: new Date("2024-01-17T15:45:00Z"),
        leadId: "lead_3",
        lead: {} as LeadDTO,
      },
    ],
    activities: [],
  },
];

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
  const [leads, setLeads] = useState<LeadDTO[]>(mockLeads);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [industryFilter, setIndustryFilter] = useState("ALL");
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [isEditLeadOpen, setIsEditLeadOpen] = useState(false);
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
  const qualifiedLeads = filteredLeads.filter(
    (lead) => lead.status === LeadStatus.INPROGRESS
  ).length;
  const activeLeads = filteredLeads.length; // Changed from isActive filter since LeadDTO doesn't have isActive

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalLeads}</div>
              <p className="text-xs text-muted-foreground">All registered leads</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Leads</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{newLeads}</div>
              <p className="text-xs text-muted-foreground">Uncontacted leads</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Qualified</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{qualifiedLeads}</div>
              <p className="text-xs text-muted-foreground">Ready for conversion</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeLeads}</div>
              <p className="text-xs text-muted-foreground">Currently being worked</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-100">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search leads by name, email, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value={LeadStatus.NEW}>New</SelectItem>
                  <SelectItem value={LeadStatus.INPROGRESS}>In Progress</SelectItem>
                  <SelectItem value={LeadStatus.LOST}>Lost</SelectItem>
                </SelectContent>
              </Select>
              <Select value={industryFilter} onValueChange={setIndustryFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Industries</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="SaaS">SaaS</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleExport} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Dialog open={isAddLeadOpen} onOpenChange={setIsAddLeadOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Lead
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Lead</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new lead. Fill in as much information as possible.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={newLead.firstName}
                      onChange={(e) => setNewLead({ ...newLead, firstName: e.target.value })}
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={newLead.lastName}
                      onChange={(e) => setNewLead({ ...newLead, lastName: e.target.value })}
                      placeholder="Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newLead.email}
                      onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                      placeholder="john.doe@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={newLead.phone}
                      onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                      placeholder="+1-555-0101"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={newLead.company}
                      onChange={(e) => setNewLead({ ...newLead, company: e.target.value })}
                      placeholder="TechCorp Inc."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">Job Title</Label>
                    <Input
                      id="jobTitle"
                      value={newLead.jobTitle}
                      onChange={(e) => setNewLead({ ...newLead, jobTitle: e.target.value })}
                      placeholder="Software Engineer"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Select
                      value={newLead.industry}
                      onValueChange={(value) => setNewLead({ ...newLead, industry: value })}
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
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={newLead.website}
                      onChange={(e) => setNewLead({ ...newLead, website: e.target.value })}
                      placeholder="https://example.com"
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={newLead.address}
                      onChange={(e) => setNewLead({ ...newLead, address: e.target.value })}
                      placeholder="123 Main St"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={newLead.city}
                      onChange={(e) => setNewLead({ ...newLead, city: e.target.value })}
                      placeholder="San Francisco"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={newLead.state}
                      onChange={(e) => setNewLead({ ...newLead, state: e.target.value })}
                      placeholder="CA"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">Zip Code</Label>
                    <Input
                      id="zipCode"
                      value={newLead.zipCode}
                      onChange={(e) => setNewLead({ ...newLead, zipCode: e.target.value })}
                      placeholder="94105"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={newLead.country}
                      onChange={(e) => setNewLead({ ...newLead, country: e.target.value })}
                      placeholder="USA"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddLeadOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddLead} disabled={!newLead.firstName || !newLead.email}>
                    Add Lead
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Leads Table */}
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
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Industry</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.map((lead) => (
                    <>
                      <TableRow key={lead.id}>
                        <TableCell className="font-medium">
                          {lead.firstName} {lead.lastName}
                        </TableCell>
                        <TableCell>{lead.email}</TableCell>
                        <TableCell>{lead.company}</TableCell>
                        <TableCell>{lead.industry}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(lead.status)}>{lead.status}</Badge>
                        </TableCell>
                        <TableCell>
                          {lead.city}, {lead.state}
                        </TableCell>
                        <TableCell>
                          {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : "N/A"}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleNotes(lead.id || "")}
                            className="p-2"
                          >
                            <StickyNote className="h-4 w-4" />
                            <span className="ml-1 text-xs">({lead.notes?.length || 0})</span>
                          </Button>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => openEditDialog(lead)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Lead</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete {lead.firstName} {lead.lastName}
                                    ? This action cannot be undone.
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
                          </div>
                        </TableCell>
                      </TableRow>
                      {expandedNotes === lead.id && lead.notes && lead.notes.length > 0 && (
                        <TableRow>
                          <TableCell colSpan={9} className="bg-muted/50">
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
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Edit Lead Dialog */}
        <Dialog open={isEditLeadOpen} onOpenChange={setIsEditLeadOpen}>
          <DialogContent className="max-w-2xl">
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
      </div>
    </div>
  );
};

export default LeadsPage;
