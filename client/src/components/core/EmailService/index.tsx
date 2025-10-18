import emailjs from "@emailjs/browser";

const InitEmailService = () => {
  emailjs.init({ publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string });
};

interface SendEmailProps {
  serviceId: string;
  templateId: string;
  templateParams: Record<string, string>;
}
const SendEmail = ({ serviceId, templateId, templateParams }: SendEmailProps) => {
  return emailjs.send(serviceId, templateId, templateParams);
};

export { InitEmailService, SendEmail };
