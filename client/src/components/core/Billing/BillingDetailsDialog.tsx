import React, { useState } from "react";
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
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  Calendar,
  DollarSign,
  User,
  Building,
  Clock,
  Download,
  Eye,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { types } from "@eleads/shared";

interface BillingDetailsDialogProps {
  billing: types.BillingDTO;
  isOpen: boolean;
  onClose: () => void;
  billingHistory?: types.BillingDTO[];
}

const statusColors = {
  PENDING: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
  PAID: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300",
  OVERDUE: "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300",
};

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const BillingDetailsDialog: React.FC<BillingDetailsDialogProps> = ({
  billing,
  isOpen,
  onClose,
  billingHistory = [],
}) => {
  const [showHistory, setShowHistory] = useState(false);
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);

  // Check billing attachments, take current file and history items
  const hasAttachments =
    billing.billingAttachments &&
    Array.isArray(billing.billingAttachments) &&
    billing.billingAttachments.length > 0;
  const hasHistory = billingHistory.length > 0 && billing.billingCycle !== "one-time";
  const currentFile = hasAttachments ? billing.billingAttachments?.[selectedFileIndex] : null;

  const handleFileDownload = (fileUrl: string, fileName?: string) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName || "billing-document";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-[90vw] !w-[70vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Billing Details
          </DialogTitle>
          <DialogDescription>
            Invoice details and billing information for {billing.client?.company || "Client"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Billing Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Invoice Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Company:</span>
                    <span>{billing.client?.company || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Contact:</span>
                    <span>{billing.client?.name || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Amount:</span>
                    <span className="font-semibold text-lg">
                      {formatCurrency(billing.billedAmount, billing.currency)}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Billing Date:</span>
                    <span>{formatDate(billing.billingDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Due Date:</span>
                    <span>{formatDate(billing.billingDueDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Status:</span>
                    <Badge className={statusColors[billing.billingStatus]}>
                      {billing.billingStatus}
                    </Badge>
                  </div>
                </div>
              </div>

              {billing.billingNotes && (
                <>
                  <Separator />
                  <div>
                    <span className="font-medium">Notes:</span>
                    <p className="text-muted-foreground mt-1">{billing.billingNotes}</p>
                  </div>
                </>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div>
                  <span className="font-medium">Billing Cycle:</span>
                  <p className="text-muted-foreground capitalize">
                    {billing.billingCycle || "N/A"}
                  </p>
                </div>
                <div>
                  <span className="font-medium">Payment Terms:</span>
                  <p className="text-muted-foreground">{billing.paymentTerms || "N/A"}</p>
                </div>
                <div>
                  <span className="font-medium">Commission:</span>
                  <p className="text-muted-foreground">{billing.userCommission}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* File Preview Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Documents ({billing.billingAttachments?.length || 0})
                </span>
                {hasAttachments && (
                  <div className="flex gap-2">
                    {(billing.billingAttachments?.length || 0) > 1 && (
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedFileIndex(Math.max(0, selectedFileIndex - 1))}
                          disabled={selectedFileIndex === 0}
                        >
                          ←
                        </Button>
                        <span className="px-2 py-1 text-sm">
                          {selectedFileIndex + 1} / {billing.billingAttachments?.length || 0}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setSelectedFileIndex(
                              Math.min(
                                (billing.billingAttachments?.length || 1) - 1,
                                selectedFileIndex + 1
                              )
                            )
                          }
                          disabled={
                            selectedFileIndex === (billing.billingAttachments?.length || 1) - 1
                          }
                        >
                          →
                        </Button>
                      </div>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleFileDownload(
                          currentFile!,
                          `billing-document-${selectedFileIndex + 1}`
                        )
                      }
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {hasAttachments ? (
                <>
                  <div className="border rounded-lg overflow-hidden">
                    <iframe
                      src={currentFile || undefined}
                      className="w-full h-96"
                      title="Billing Document Preview"
                      onError={(e) => {
                        console.error("Failed to load document:", e);
                        // Fallback to a simple link if iframe fails
                      }}
                    />
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    <p>Preview of billing document. Click download to save the file.</p>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <FileText className="h-12 w-12 mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No documents attached</h3>
                  <p className="text-center max-w-md">
                    This billing record doesn't have any attached documents or invoices.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Billing History Section */}
          {hasHistory && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>Billing History</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowHistory(!showHistory)}
                    className="flex items-center gap-2"
                  >
                    {showHistory ? (
                      <>
                        <ChevronUp className="h-4 w-4" />
                        Hide History
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4" />
                        Show History ({billingHistory.length} records)
                      </>
                    )}
                  </Button>
                </CardTitle>
              </CardHeader>
              {showHistory && (
                <CardContent>
                  <div className="space-y-3">
                    {billingHistory.map((historyItem, index) => (
                      <div
                        key={historyItem.id || index}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{formatDate(historyItem.billingDate)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">
                              {formatCurrency(historyItem.billedAmount, historyItem.currency)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={statusColors[historyItem.billingStatus]}>
                            {historyItem.billingStatus}
                          </Badge>
                          {historyItem.billingAttachments &&
                            historyItem.billingAttachments.length > 0 && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleFileDownload(
                                    historyItem.billingAttachments?.[0] || "",
                                    `billing-history-${index + 1}`
                                  )
                                }
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Button>
                            )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BillingDetailsDialog;
