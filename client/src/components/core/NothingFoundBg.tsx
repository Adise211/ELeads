import Illustration from "@/assets/icons/Illustration";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NothingFoundBg = () => {
  const navigate = useNavigate();

  return (
    <div className="w-screen min-h-screen max-w-screen m-0 p-0 pt-20 pb-20">
      <div className="relative">
        <Illustration className="absolute inset-0 opacity-75 text-gray-100 dark:text-gray-700" />
        <div className="pt-56 relative z-10 sm:pt-32">
          <div className="font-outfit text-center font-medium text-4xl sm:text-3xl">
            Nothing to see here
          </div>
          <div className="max-w-[540px] mx-auto mt-8 mb-12 text-center text-gray-500 text-lg font-normal leading-relaxed tracking-wide text-balance">
            Page you are trying to open does not exist. You may have mistyped the address, or the
            page has been moved to another URL. If you think this is an error contact support.
          </div>
          <div className="flex justify-center">
            <Button size="lg" onClick={() => navigate("/home")}>
              Take me back to home page
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NothingFoundBg;
