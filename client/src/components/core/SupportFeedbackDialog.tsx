import * as React from "react";
import { Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { InitEmailService, SendEmail } from "./EmailService";
import { useAuthStore } from "@/stores/authStore";
import { showSuccessToast, showErrorToast } from "@/utils/toast";

export type DialogType = "support" | "feedback";

interface SupportFeedbackDialogProps {
  isOpen: boolean;
  onClose: () => void;
  type: DialogType;
}

interface FormData {
  subject: string;
  content: string;
}

interface FormErrors {
  subject?: string;
  content?: string;
}

export function SupportFeedbackDialog({ isOpen, onClose, type }: SupportFeedbackDialogProps) {
  const user = useAuthStore((state) => state.user);
  const [formData, setFormData] = React.useState<FormData>({
    subject: "",
    content: "",
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState<FormErrors>({});

  // Initialize EmailService on component mount
  React.useEffect(() => {
    InitEmailService();
  }, []);

  const isSupport = type === "support";
  const title = isSupport ? "Contact Support" : "Send Feedback";
  const description = isSupport
    ? "Need help? Send us a message and we'll get back to you as soon as possible."
    : "We'd love to hear your thoughts! Share your feedback to help us improve.";

  const handleInputChange = (field: keyof FormData, value: string | File | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare template parameters for EmailJS
      const templateParams = {
        to_name: "ELeads Support Team",
        from_name: user ? `${user.firstName} ${user.lastName}` : "Guest User",
        from_email: user?.email || "guest@example.com",
        subject: formData.subject,
        message: formData.content,
        type: isSupport ? "Support Request" : "Feedback",
        user_id: user?.id || "guest",
        timestamp: new Date().toLocaleString(),
      };

      // Use different template IDs for support vs feedback
      // const templateId = isSupport ? "support_template" : "feedback_template";
      const templateId = "eleads_template";
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID; // You'll need to configure this in your EmailJS account

      // Send email using EmailService
      await SendEmail({
        serviceId,
        templateId,
        templateParams,
      });

      // Reset form and close dialog
      setFormData({ subject: "", content: "" });
      setErrors({});
      onClose();

      // Show success toast
      showSuccessToast(
        isSupport
          ? "Support request sent successfully! We'll get back to you soon."
          : "Thank you for your feedback! We appreciate your input."
      );
    } catch (error) {
      console.error(`Error submitting ${type}:`, error);
      showErrorToast(
        isSupport
          ? "Failed to send support request. Please try again or contact us directly."
          : "Failed to send feedback. Please try againb later."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({ subject: "", content: "" });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="subject" className="text-sm font-medium">
              Subject
            </label>
            <Input
              id="subject"
              placeholder="Brief description of your message"
              value={formData.subject}
              onChange={(e) => handleInputChange("subject", e.target.value)}
              className={cn(errors.subject && "border-red-500")}
            />
            {errors.subject && <p className="text-sm text-red-500">{errors.subject}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium">
              Message
            </label>
            <Textarea
              id="content"
              placeholder={
                isSupport
                  ? "Please describe your issue in detail..."
                  : "Tell us what you think or how we can improve..."
              }
              value={formData.content}
              onChange={(e) => handleInputChange("content", e.target.value)}
              className={cn("min-h-[100px]", errors.content && "border-red-500")}
            />
            {errors.content && <p className="text-sm text-red-500">{errors.content}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                "Sending..."
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  {isSupport ? "Send Support Request" : "Send Feedback"}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
