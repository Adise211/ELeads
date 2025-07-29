import IconExclamationTriangle from "@/assets/icons/IconExclamationTriangle";
import IconInfoCircle from "@/assets/icons/IconInfoCircle";
import IconShieldExclamation from "@/assets/icons/IconShieldExclamation";
import IconCheck from "@/assets/icons/IconCheck";
import { Callout } from "@radix-ui/themes";

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
    <Callout.Root color={options[type].color as "green" | "red" | "yellow" | "blue"}>
      <Callout.Icon>{icon ?? options[type].icon}</Callout.Icon>
      {title && <div className="font-semibold mb-1">{title}</div>}
      <Callout.Text>{message}</Callout.Text>
    </Callout.Root>
  );
};

export default AppAlert;
