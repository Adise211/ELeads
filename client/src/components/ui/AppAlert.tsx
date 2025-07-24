import IconExclamationTriangle from "@/assets/icons/IconExclamationTriangle";
import { Alert } from "@mantine/core";
import IconInfoCircle from "@/assets/icons/IconInfoCircle";
import IconShieldExclamation from "@/assets/icons/IconShieldExclamation";
import IconCheck from "@/assets/icons/IconCheck";

interface AppAlertProps {
  title?: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
  icon?: React.ReactNode;
}

const AppAlert = ({ title, message, type, icon }: AppAlertProps) => {
  const options = {
    success: {
      color: "green",
      icon: <IconCheck className="size-6" />,
    },
    error: {
      color: "red",
      icon: <IconExclamationTriangle className="size-6" />,
    },
    warning: {
      color: "yellow",
      icon: <IconShieldExclamation className="size-6" />,
    },
    info: {
      color: "blue",
      icon: <IconInfoCircle className="size-6" />,
    },
  };

  return (
    <Alert title={title} color={options[type].color} icon={options[type].icon || icon}>
      {message}
    </Alert>
  );
};

export default AppAlert;
