import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SoonBadgeProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const SoonBadge = React.forwardRef<HTMLSpanElement, SoonBadgeProps>(
  ({ className, size = "sm", ...props }, ref) => {
    const sizeClasses = {
      sm: "text-xs px-2 py-0.5",
      md: "text-sm px-2.5 py-1",
      lg: "text-base px-3 py-1.5",
    };

    return (
      <Badge
        ref={ref}
        className={cn(
          "border-transparent bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300",
          "font-medium tracking-wide",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        Coming soon
      </Badge>
    );
  }
);

SoonBadge.displayName = "SoonBadge";

export default SoonBadge;
