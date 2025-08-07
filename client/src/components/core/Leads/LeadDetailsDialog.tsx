import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Mail,
  Phone,
  Building2,
  Globe,
  MapPin,
  User,
  Clock,
  FileText,
  Activity,
  Eye,
} from "lucide-react";
import type { LeadDTO } from "@eleads/shared";
import { LeadStatus } from "@eleads/shared";

interface LeadDetailsDialogProps {
  lead: LeadDTO;
  getStatusColor: (status: LeadStatus) => string;
  assignedToUser: string;
}

const activityTypeIcons = {
  EMAIL: Mail,
  CALL: Phone,
  MEETING: Calendar,
  TASK: FileText,
  NOTE: FileText,
  OTHER: Activity,
};

const LeadDetailsDialog = ({ lead, getStatusColor, assignedToUser }: LeadDetailsDialogProps) => {
  const fullName = `${lead.firstName} ${lead.lastName || ""}`.trim();
  const fullAddress = [lead.address, lead.city, lead.state, lead.zipCode, lead.country]
    .filter(Boolean)
    .join(", ");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="!max-w-[90vw] !w-[60vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {fullName}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{lead.email}</span>
              </div>
              {lead.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{lead.phone}</span>
                </div>
              )}
              {lead.website && (
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={lead.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {lead.website}
                  </a>
                </div>
              )}
              {fullAddress && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{fullAddress}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Professional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Professional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {lead.company && (
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span>{lead.company}</span>
                </div>
              )}
              {lead.jobTitle && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Job Title:</span>
                  <p>{lead.jobTitle}</p>
                </div>
              )}
              {lead.industry && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Industry:</span>
                  <p>{lead.industry}</p>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">Status:</span>
                <Badge className={getStatusColor(lead.status)}>
                  {lead.status === LeadStatus.INPROGRESS ? "IN PROGRESS" : lead.status}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {lead.notes && lead.notes.length > 0 ? (
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Notes</CardTitle>
                <CardDescription>{lead.notes.length} note(s)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {lead.notes.map((note) => (
                    <div key={note.id} className="border-l-2 border-muted pl-4">
                      <p className="text-sm">{note.content}</p>
                      <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {note.createdAt ? new Date(note.createdAt).toLocaleDateString() : "N/A"}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Notes</CardTitle>
                <CardDescription>No notes found yet</CardDescription>
              </CardHeader>
            </Card>
          )}

          {/* Activities */}
          {lead.activities && lead.activities.length > 0 ? (
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Recent Activities</CardTitle>
                <CardDescription>{lead.activities.length} activity(ies)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {lead.activities.map((activity) => {
                    const IconComponent = activityTypeIcons[activity.type];
                    return (
                      <div key={activity.id} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {activity.type}
                            </Badge>
                          </div>
                          {activity.description && (
                            <p className="text-sm mt-1">{activity.description}</p>
                          )}
                          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {activity.createdAt
                              ? new Date(activity.createdAt).toLocaleDateString()
                              : "N/A"}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Recent Activities</CardTitle>
                <CardDescription>No activities found yet</CardDescription>
              </CardHeader>
            </Card>
          )}

          {/* Metadata */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Metadata</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-muted-foreground">Created:</span>
                  <p>{lead.createdAt ? new Date(lead.createdAt).toLocaleString() : "N/A"}</p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Last Updated:</span>
                  <p>{lead.updatedAt ? new Date(lead.updatedAt).toLocaleString() : "N/A"}</p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Lead ID:</span>
                  <p className="font-mono text-xs">{lead.id}</p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Assigned To:</span>
                  <p>{assignedToUser}</p>
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
