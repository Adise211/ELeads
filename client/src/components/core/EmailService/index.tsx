import emailjs from "@emailjs/browser";
import type { EmailServiceForOTPTemplateParams } from "client.types";

const InitEmailService = () => {
  emailjs.init({ publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string });
};
// Initialize the email service
InitEmailService();
interface SendEmailProps {
  serviceId: string;
  templateId: string;
  templateParams: Record<string, string | number | Date> | EmailServiceForOTPTemplateParams;
}

// Send email
const SendEmail = async ({ serviceId, templateId, templateParams }: SendEmailProps) => {
  try {
    const response = await emailjs.send(serviceId, templateId, templateParams);
    return { success: true, status: response.status };
  } catch (error) {
    console.error("error sending email", error);
    throw error;
  }
};

export { InitEmailService, SendEmail };
