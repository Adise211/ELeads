import { Zap } from "lucide-react";

const Logo = () => {
  return (
    <>
      <a href="/home" className="flex items-center gap-2 font-medium">
        <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
          <Zap className="size-4" />
        </div>
        ELeads
      </a>
    </>
  );
};

export default Logo;
