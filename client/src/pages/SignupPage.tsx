import { useState } from "react";
import { Link } from "react-router-dom";
import PersonalInfoStep from "@/components/core/Auth/PersonalInfoStep";
import WorkspaceStep from "@/components/core/Auth/WorkspaceStep";
import { ChevronRight } from "lucide-react";
import type { SignupFormData } from "../../client.types";
import { signupFormSchema } from "@/lib/form-validation-schema";
import api from "@/services/httpConfig";
import { showSuccessToast } from "@/utils/toast";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<SignupFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    workspaceType: "new",
    workspaceName: "",
    workspaceId: "",
  });

  const updateFormData = (updates: Partial<SignupFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handlePersonalInfoNext = () => {
    setCurrentStep(2);
  };

  const handleWorkspaceBack = () => {
    setCurrentStep(1);
  };

  const handleComplete = async () => {
    const validationResult = signupFormSchema.safeParse(formData);

    if (!validationResult.success) {
      console.log("Validation errors:", validationResult.error);
    } else {
      const {
        firstName,
        lastName,
        email,
        password,
        phone,
        workspaceName,
        workspaceType,
        workspaceId,
      } = formData;

      let workspace = {};
      if (workspaceType === "new") {
        workspace = {
          name: workspaceName,
        };
      } else {
        workspace = {
          id: workspaceId,
        };
      }

      try {
        const data = {
          user: { firstName, lastName, email, password, phone },
          workspace,
        };
        const response = await api.post("/users/register", data);
        if (response.data.success) {
          showSuccessToast(response.data.message);
          navigate("/login");
        }
      } catch (error) {
        console.log("Error in signup user", error);
      }
    }
  };
  const signupBg =
    "https://images.unsplash.com/photo-1484242857719-4b9144542727?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1280&q=80";

  return (
    <div
      className="min-h-screen flex items-center justify-center relative"
      style={{
        backgroundImage: `url(${signupBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-sm" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md mx-auto px-4">
        {/* Step indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  currentStep >= 1
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                1
              </div>
              <span className="ml-2 text-sm font-medium text-foreground hidden sm:inline">
                Personal Info
              </span>
            </div>

            <div className="flex-1 h-px bg-border relative">
              <ChevronRight className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground bg-background" />
            </div>

            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  currentStep >= 2
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                2
              </div>
              <span className="ml-2 text-sm font-medium text-foreground hidden sm:inline">
                Workspace
              </span>
            </div>
          </div>
        </div>

        {/* Form Steps */}
        {currentStep === 1 && (
          <PersonalInfoStep
            formData={{
              firstName: formData.firstName,
              lastName: formData.lastName,
              email: formData.email,
              password: formData.password,
              phone: formData.phone,
            }}
            onUpdate={updateFormData}
            onNext={handlePersonalInfoNext}
          />
        )}

        {currentStep === 2 && (
          <WorkspaceStep
            formData={{
              workspaceType: formData.workspaceType ?? "new",
              workspaceName: formData.workspaceName ?? "",
              workspaceId: formData.workspaceId,
            }}
            onUpdate={updateFormData}
            onComplete={handleComplete}
            onBack={handleWorkspaceBack}
          />
        )}

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-primary hover:text-primary-glow transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
