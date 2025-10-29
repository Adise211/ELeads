import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Building2, Mail, Phone, MapPin, Globe, Calendar, Tag } from "lucide-react";
import { types } from "@eleads/shared";

interface ClientDetailsDialogProps {
  client: types.ClientDTO;
  isOpen: boolean;
  onClose: () => void;
}

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

const formatDate = (dateString: string | Date) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const ClientDetailsDialog: React.FC<ClientDetailsDialogProps> = ({ client, isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-[90vw] !w-[50vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Client Details</span>
          </DialogTitle>
          <DialogDescription>
            View detailed information about {client.name || "this client"}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Basic Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Name</label>
                  <p className="text-sm font-medium">{client.name || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <p className="text-sm">{client.email}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <p className="text-sm">{client.phone || "N/A"}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Website</label>
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-gray-400" />
                    {client.website ? (
                      <a
                        href={
                          client.website.startsWith("http")
                            ? client.website
                            : `https://${client.website}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        {client.website}
                      </a>
                    ) : (
                      <p className="text-sm text-gray-400">N/A</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div className="mt-1">
                    <Badge className={statusColors[client.status]}>{client.status}</Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Priority</label>
                  <div className="mt-1">
                    <Badge className={priorityColors[client.priority]}>{client.priority}</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="h-4 w-4" />
                <span>Company Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Company</label>
                  <p className="text-sm font-medium">{client.company}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Industry</label>
                  <div className="flex items-center space-x-2">
                    <Tag className="h-4 w-4 text-gray-400" />
                    <p className="text-sm">{client.industry || "N/A"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Location</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Address</label>
                  <p className="text-sm">{client.address || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">City</label>
                  <p className="text-sm">{client.city || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">State</label>
                  <p className="text-sm">{client.state || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Zip Code</label>
                  <p className="text-sm">{client.zipCode || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Country</label>
                  <p className="text-sm">{client.country || "N/A"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Additional Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Created</label>
                  <p className="text-sm">
                    {client.createdAt ? formatDate(client.createdAt) : "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Last Updated</label>
                  <p className="text-sm">
                    {client.updatedAt ? formatDate(client.updatedAt) : "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClientDetailsDialog;
