import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectGroup {
  label?: string;
  options: SelectOption[];
}

interface AppSelectProps {
  placeholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  options?: SelectOption[];
  groups?: SelectGroup[];
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
}

const AppSelect = ({
  placeholder = "Select an option",
  value,
  onValueChange,
  options,
  groups,
  disabled = false,
  className,
  triggerClassName,
}: AppSelectProps) => {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className={triggerClassName}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className={className}>
        {groups
          ? groups.map((group, groupIndex) => (
              <SelectGroup key={groupIndex}>
                {group.label && <SelectLabel>{group.label}</SelectLabel>}
                {group.options.map((option) => (
                  <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            ))
          : options?.map((option) => (
              <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </SelectItem>
            ))}
      </SelectContent>
    </Select>
  );
};

export default AppSelect;
