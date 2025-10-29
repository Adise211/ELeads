import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, ArrowLeft, CheckCircle, Clock, RefreshCw } from "lucide-react";
import { authService } from "@/services";
import { showSuccessToast, showErrorToast } from "@/utils/toast";
import { AxiosError } from "axios";

interface EmailVerificationStepProps {
  formData: {
    email: string;
    otp: string;
    isEmailVerified: boolean;
  };
  onUpdate: (data: Partial<EmailVerificationStepProps["formData"]>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function EmailVerificationStep({
  formData,
  onUpdate,
  onNext,
  onBack,
}: EmailVerificationStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [hasSentInitialOTP, setHasSentInitialOTP] = useState(false);

  // Send OTP when component mounts
  useEffect(() => {
    const sendInitialOTP = async () => {
      if (!hasSentInitialOTP && formData.email) {
        setIsResending(true);
        try {
          const response = await authService.sendOTPToUser(formData.email);
          if (response.success) {
            showSuccessToast(response.message || "Verification code sent to your email!");
            setHasSentInitialOTP(true);
            setResendCooldown(60);
          }
        } catch (error) {
          const errorMessage =
            error instanceof AxiosError
              ? error?.response?.data?.message || "Failed to send verification code."
              : "Failed to send verification code.";
          showErrorToast(errorMessage);
        } finally {
          setIsResending(false);
        }
      }
    };

    sendInitialOTP();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Countdown timer for resend button
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.otp.trim()) {
      newErrors.otp = "OTP is required";
    } else if (!/^\d{6}$/.test(formData.otp.trim())) {
      newErrors.otp = "OTP must be 6 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsVerifying(true);
      try {
        const response = await authService.verifyOTPCode(formData.email, formData.otp);
        if (response.success) {
          showSuccessToast(response.message || "Email verified successfully!");
          onUpdate({ isEmailVerified: true });
          onNext();
        }
      } catch (error) {
        const errorMessage =
          error instanceof AxiosError
            ? error?.response?.data?.message || "Invalid OTP. Please try again."
            : "Invalid OTP. Please try again.";
        setErrors({ otp: errorMessage });
        showErrorToast(errorMessage);
      } finally {
        setIsVerifying(false);
      }
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    try {
      const response = await authService.sendOTPToUser(formData.email);
      if (response.success) {
        showSuccessToast(response.message || "Verification code sent successfully!");
        setResendCooldown(60);
        setErrors({});
      }
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error?.response?.data?.message || "Failed to resend OTP. Please try again."
          : "Failed to resend OTP. Please try again.";
      setErrors({ general: errorMessage });
      showErrorToast(errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  const formatEmail = (email: string) => {
    const [localPart, domain] = email.split("@");
    if (localPart.length <= 3) {
      return `${localPart[0]}***@${domain}`;
    }
    return `${localPart[0]}${"*".repeat(localPart.length - 2)}${localPart[localPart.length - 1]}@${domain}`;
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-[var(--glass-bg)] border-[var(--glass-border)] backdrop-blur-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
          Verify Your Email
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          We've sent a 6-digit code to {formatEmail(formData.email)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp" className="text-sm font-medium text-foreground">
              Verification Code
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="otp"
                type="text"
                placeholder="123456"
                value={formData.otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                  onUpdate({ otp: value });
                }}
                className={`pl-10 bg-background/50 border-border text-center text-lg tracking-widest ${
                  errors.otp ? "border-destructive" : ""
                }`}
                maxLength={6}
                autoComplete="one-time-code"
              />
            </div>
            {errors.otp && <p className="text-xs text-destructive">{errors.otp}</p>}
          </div>

          {/* OTP Input Helper */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Enter the 6-digit code sent to your email
            </p>
          </div>

          {/* Resend OTP Section */}
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">Didn't receive the code?</p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleResendOTP}
              disabled={isResending || resendCooldown > 0}
              className="text-primary hover:text-primary-glow"
            >
              {isResending ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : resendCooldown > 0 ? (
                <>
                  <Clock className="h-4 w-4 mr-2" />
                  Resend in {resendCooldown}s
                </>
              ) : (
                "Resend Code"
              )}
            </Button>
          </div>

          {/* General Error */}
          {errors.general && (
            <div className="text-center">
              <p className="text-xs text-destructive">{errors.general}</p>
            </div>
          )}

          <div className="flex space-x-3 mt-6">
            <Button type="button" variant="outline" onClick={onBack} className="flex-1">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button type="submit" variant="default" className="flex-1" disabled={isVerifying}>
              {isVerifying ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Verify
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            Check your spam folder if you don't see the email
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
