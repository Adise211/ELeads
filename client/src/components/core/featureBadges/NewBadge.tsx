import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface NewBadgeProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const NewBadge = React.forwardRef<HTMLSpanElement, NewBadgeProps>(
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
          "border-transparent bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
          "font-medium tracking-wide",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        New
      </Badge>
    );
  }
);

NewBadge.displayName = "NewBadge";

export { NewBadge };
