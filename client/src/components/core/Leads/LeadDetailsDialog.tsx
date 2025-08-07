import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  StickyNote,
  Mail,
  Phone,
  Building,
  Eye,
  Globe,
  MapPin,
  Calendar,
  User,
  Activity,
} from "lucide-react";
import type { LeadDTO } from "@eleads/shared";
import { LeadStatus } from "@eleads/shared";

interface LeadDetailsDialogProps {
  lead: LeadDTO;
  getStatusColor: (status: LeadStatus) => string;
}

const LeadDetailsDialog = ({ lead, getStatusColor }: LeadDetailsDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="!max-w-[90vw] !w-[50vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Lead Details
          </DialogTitle>
          <DialogDescription>
            Complete information for {lead.firstName} {lead.lastName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                  <p className="text-sm">
                    {lead.firstName} {lead.lastName}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">{lead.email || "N/A"}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                  <div className="space-y-1">
                    {lead.phone && Array.isArray(lead.phone) && lead.phone.length > 0 ? (
                      lead.phone.map((phone, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <p className="text-sm">{phone}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">N/A</p>
                    )}
                  </div>
                </div>
                <div className="space-y-2 space-x-2">
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <Badge className={getStatusColor(lead.status)}>
                    {lead.status === LeadStatus.INPROGRESS ? "IN PROGRESS" : lead.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Company Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Company</label>
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">{lead.company || "N/A"}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Job Title</label>
                  <p className="text-sm">{lead.jobTitle || "N/A"}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Industry</label>
                  <p className="text-sm">{lead.industry || "N/A"}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Website</label>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">{lead.website || "N/A"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          {(lead.address || lead.city || lead.state || lead.zipCode || lead.country) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Address Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Address</label>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <p className="text-sm">{lead.address || "N/A"}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">City</label>
                    <p className="text-sm">{lead.city || "N/A"}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">State</label>
                    <p className="text-sm">{lead.state || "N/A"}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">ZIP Code</label>
                    <p className="text-sm">{lead.zipCode || "N/A"}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Country</label>
                    <p className="text-sm">{lead.country || "N/A"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Activity History */}
          {lead.activities && lead.activities.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Activity History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {lead.activities.map((activity, index) => (
                    <div key={activity.id || index} className="border-l-4 border-primary pl-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-sm">{activity.type}</p>
                          <p className="text-sm text-muted-foreground">{activity.description}</p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {activity.createdAt
                            ? new Date(activity.createdAt).toLocaleString()
                            : "N/A"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          {lead.notes && lead.notes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <StickyNote className="h-5 w-5" />
                  Notes ({lead.notes.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {lead.notes.map((note) => (
                    <div key={note.id} className="border-l-4 border-primary pl-4">
                      <p className="text-sm">{note.content}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {note.createdAt ? new Date(note.createdAt).toLocaleString() : "N/A"}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timestamps */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Timestamps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Created</label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">
                      {lead.createdAt ? new Date(lead.createdAt).toLocaleString() : "N/A"}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">
                      {lead.updatedAt ? new Date(lead.updatedAt).toLocaleString() : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LeadDetailsDialog;
