import IconExclamationTriangle from "@/assets/icons/IconExclamationTriangle";
import { Alert } from "@mantine/core";
import IconInfoCircle from "@/assets/icons/IconInfoCircle";

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
      icon: <IconInfoCircle className="size-6" />, // or your success icon
    },
    error: {
      color: "red",
      icon: <IconExclamationTriangle className="size-6" />,
    },
    warning: {
      color: "yellow",
      icon: <IconExclamationTriangle className="size-6" />,
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
