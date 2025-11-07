import { useState } from "react";
import { Link } from "react-router-dom";
import PersonalInfoStep from "@/components/core/Auth/PersonalInfoStep";
import EmailVerificationStep from "@/components/core/Auth/EmailVerificationStep";
import PasswordStep from "@/components/core/Auth/PasswordStep";
import WorkspaceStep from "@/components/core/Auth/WorkspaceStep";
import { ChevronRight } from "lucide-react";
import type { SignupFormData } from "../../client.types";
import { authService } from "@/services";
import { showSuccessToast } from "@/utils/toast";
import { useNavigate } from "react-router-dom";
import { schemas, consts } from "@eleads/shared";
import AppAlert from "@/components/ui/app-alert";
import { AxiosError } from "axios";

const SignupPage = () => {
  const navigate = useNavigate();
  const { VERIFY_EMAIL_BY_OTP } = consts.featureFlags;
  const [currentStep, setCurrentStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [generateCustomOTPData, setGenerateCustomOTPData] = useState<{
    otp: string;
    expiresAt: Date;
  } | null>(null);
  const [formData, setFormData] = useState<SignupFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    otp: "",
    isEmailVerified: false,
    workspaceType: "new",
    workspaceName: "",
    workspaceId: "",
  });

  const updateFormData = (updates: Partial<SignupFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handlePersonalInfoNext = async () => {
    console.log("in handlePersonalInfoNext");
    // if email verification by OTP is enabled, generate a custom OTP code and move to the email verification step
    if (VERIFY_EMAIL_BY_OTP) {
      console.log("generating custom OTP code before moving to the email verification step");
      try {
        const response = await authService.generateCustomOTPCode(formData.email);
        console.log("response from generate custom OTP code", response);
        if (response.success) {
          setGenerateCustomOTPData((prev) => ({
            ...prev,
            otp: response.data.otp,
            expiresAt: response.data.expiresAt,
          }));
          setErrorMessage(""); // clear the error message
          setCurrentStep(2);
        }
      } catch (error) {
        console.log("Error in generating custom OTP code", error);
        setErrorMessage(
          error instanceof AxiosError
            ? error?.response?.data.message
            : "Failed to generate custom OTP code"
        );
      }
    } else {
      console.log("moving to the email verification step without generating custom OTP code");
      setCurrentStep(2);
      setErrorMessage(""); // clear the error message
    }
  };

  const handleEmailVerificationNext = () => {
    setCurrentStep(3);
  };

  const handleEmailVerificationBack = () => {
    setCurrentStep(1);
  };

  const handlePasswordNext = () => {
    // Total steps: 3 if email verification disabled, 4 if enabled
    setCurrentStep(VERIFY_EMAIL_BY_OTP ? 4 : 3);
  };

  const handlePasswordBack = () => {
    // Go back to email verification if enabled, otherwise to personal info
    setCurrentStep(VERIFY_EMAIL_BY_OTP ? 2 : 1);
  };

  const handleWorkspaceBack = () => {
    setCurrentStep(VERIFY_EMAIL_BY_OTP ? 3 : 2);
  };

  const handleComplete = async () => {
    let workspace = {};
    // create the workspace data
    if (formData.workspaceType === "new") {
      workspace = {
        name: formData.workspaceName,
      };
    } else {
      workspace = {
        id: formData.workspaceId,
      };
    }
    // get the user data from the form data
    const { firstName, lastName, email, password, phone } = formData;
    // create the signup data
    const sigenupData = { user: { firstName, lastName, email, password, phone }, workspace };

    const validationResult = schemas.registerUserSchema.safeParse(sigenupData);
    if (!validationResult.success) {
      // console.log("Validation errors:", validationResult.error);
    } else {
      try {
        const response = await authService.register(sigenupData);
        if (response.success) {
          showSuccessToast(response.message || "Registration successful!");
          navigate("/login");
        }
      } catch (error) {
        console.log("Error in signup user", error);
        setErrorMessage(
          error instanceof AxiosError ? error?.response?.data.message : "Failed to register user"
        );
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
          <div className="flex items-center justify-center space-x-1 sm:space-x-2">
            <div className="flex items-center">
              <div
                className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-colors ${
                  currentStep >= 1
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                1
              </div>
              <span className="ml-1 sm:ml-2 text-xs sm:text-sm font-medium text-foreground hidden md:inline">
                Personal
              </span>
            </div>

            {VERIFY_EMAIL_BY_OTP && (
              <>
                <div className="flex-1 h-px bg-border relative max-w-4 sm:max-w-8">
                  <ChevronRight className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground bg-background" />
                </div>

                <div className="flex items-center">
                  <div
                    className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-colors ${
                      currentStep >= 2
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    2
                  </div>
                  <span className="ml-1 sm:ml-2 text-xs sm:text-sm font-medium text-foreground hidden md:inline">
                    Email
                  </span>
                </div>
              </>
            )}

            <div className="flex-1 h-px bg-border relative max-w-4 sm:max-w-8">
              <ChevronRight className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground bg-background" />
            </div>

            <div className="flex items-center">
              <div
                className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-colors ${
                  currentStep >= (VERIFY_EMAIL_BY_OTP ? 3 : 2)
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {VERIFY_EMAIL_BY_OTP ? 3 : 2}
              </div>
              <span className="ml-1 sm:ml-2 text-xs sm:text-sm font-medium text-foreground hidden md:inline">
                Password
              </span>
            </div>

            <div className="flex-1 h-px bg-border relative max-w-4 sm:max-w-8">
              <ChevronRight className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground bg-background" />
            </div>

            <div className="flex items-center">
              <div
                className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-colors ${
                  currentStep >= (VERIFY_EMAIL_BY_OTP ? 4 : 3)
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {VERIFY_EMAIL_BY_OTP ? 4 : 3}
              </div>
              <span className="ml-1 sm:ml-2 text-xs sm:text-sm font-medium text-foreground hidden md:inline">
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
              phone: formData.phone,
            }}
            onUpdate={updateFormData}
            onNext={handlePersonalInfoNext}
          />
        )}

        {VERIFY_EMAIL_BY_OTP && currentStep === 2 && (
          <EmailVerificationStep
            formData={{
              email: formData.email,
              otp: formData.otp,
              isEmailVerified: formData.isEmailVerified,
            }}
            generateCustomOTPData={generateCustomOTPData}
            onUpdate={updateFormData}
            onNext={handleEmailVerificationNext}
            onBack={handleEmailVerificationBack}
          />
        )}

        {currentStep === (VERIFY_EMAIL_BY_OTP ? 3 : 2) && (
          <PasswordStep
            formData={{
              password: formData.password,
            }}
            onUpdate={updateFormData}
            onNext={handlePasswordNext}
            onBack={handlePasswordBack}
          />
        )}

        {currentStep === (VERIFY_EMAIL_BY_OTP ? 4 : 3) && (
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

        {
          <div className="mt-4">
            {errorMessage && <AppAlert message={errorMessage} type="error" />}
          </div>
        }

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
