import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Zap } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
// import onboarding from "@/lib/onboarding";

const WelcomeDialog = () => {
  const [open, setOpen] = useState(false);
  const { hasSeenWelcome, setHasSeenWelcome } = useAuthStore();

  useEffect(() => {
    // Check if user has seen the welcome dialog before
    if (!hasSeenWelcome) {
      setOpen(true);
    }
  }, [hasSeenWelcome]);

  const handleClose = () => {
    setOpen(false);
    setHasSeenWelcome(true);
    // onboarding.drive();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md border-0 bg-gradient-to-br from-background to-background/80 backdrop-blur-sm">
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-violet-600 shadow-lg relative">
            <Zap className="h-8 w-8 text-white" />
            <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-violet-300 animate-pulse" />
          </div>
          <div className="space-y-2">
            <DialogTitle className="text-2xl text-center font-bold">
              <span className="bg-gradient-to-r from-violet-600 to-violet-800 bg-clip-text text-transparent">
                Welcome Aboard!
              </span>
              <span className="ml-2">🚀</span>
            </DialogTitle>
            <DialogDescription className="text-center space-y-3 text-base">
              <p className="font-medium text-foreground">Thanks for exploring our application!</p>
              <div className="p-4 rounded-lg bg-violet-50/50 border border-violet-200/50">
                <p className="text-sm text-muted-foreground">
                  🔧 This app is currently in{" "}
                  <span className="font-semibold text-violet-600">active development</span>
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Some features might not work as expected while we polish things up.
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                We're working hard to bring you an amazing experience! 💫
              </p>
            </DialogDescription>
          </div>
        </DialogHeader>
        <div className="flex justify-center mt-6">
          <Button
            onClick={handleClose}
            className="w-full bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-700 hover:to-violet-800 transition-all duration-300 shadow-lg hover:shadow-xl"
            size="lg"
          >
            Let's Get Started! ✨
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeDialog;
