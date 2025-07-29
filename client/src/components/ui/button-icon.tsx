import { Button } from "@/components/ui/button";

export function ButtonIcon({
  icon,
  ...props
}: { icon: React.ReactNode } & React.ComponentProps<"button">) {
  return (
    <Button variant="ghost" size="icon" className="size-8" {...props}>
      {icon}
    </Button>
  );
}
