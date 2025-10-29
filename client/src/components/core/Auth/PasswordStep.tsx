import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Lock, ArrowLeft, Check } from "lucide-react";

interface PasswordStepProps {
  formData: {
    password: string;
  };
  onUpdate: (data: Partial<PasswordStepProps["formData"]>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function PasswordStep({ formData, onUpdate, onNext, onBack }: PasswordStepProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])/.test(formData.password)) {
      newErrors.password = "Password must contain at least one lowercase letter";
    } else if (!/(?=.*[A-Z])/.test(formData.password)) {
      newErrors.password = "Password must contain at least one uppercase letter";
    } else if (!/(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain at least one number";
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onNext();
    }
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/(?=.*[a-z])/.test(password)) strength++;
    if (/(?=.*[A-Z])/.test(password)) strength++;
    if (/(?=.*\d)/.test(password)) strength++;
    if (/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
  const strengthColors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-blue-500",
    "bg-green-500",
  ];

  return (
    <Card className="w-full max-w-md mx-auto bg-[var(--glass-bg)] border-[var(--glass-border)] backdrop-blur-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
          Secure Your Account
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Create a strong password to protect your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-foreground">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => onUpdate({ password: e.target.value })}
                className={`pl-10 pr-10 bg-background/50 border-border ${
                  errors.password ? "border-destructive" : ""
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
          </div>

          {/* Password Strength Indicator */}
          {formData.password && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Password Strength</span>
                <span
                  className={`font-medium ${
                    passwordStrength <= 2
                      ? "text-red-500"
                      : passwordStrength <= 3
                        ? "text-yellow-500"
                        : "text-green-500"
                  }`}
                >
                  {strengthLabels[passwordStrength - 1] || "Very Weak"}
                </span>
              </div>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`h-1 flex-1 rounded-full ${
                      level <= passwordStrength
                        ? strengthColors[passwordStrength - 1] || "bg-gray-300"
                        : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Password Requirements */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Password must contain:</p>
            <div className="space-y-1">
              {[
                { text: "At least 8 characters", met: formData.password.length >= 8 },
                { text: "One lowercase letter", met: /(?=.*[a-z])/.test(formData.password) },
                { text: "One uppercase letter", met: /(?=.*[A-Z])/.test(formData.password) },
                { text: "One number", met: /(?=.*\d)/.test(formData.password) },
              ].map((requirement, index) => (
                <div key={index} className="flex items-center space-x-2 text-xs">
                  <div
                    className={`w-3 h-3 rounded-full flex items-center justify-center ${
                      requirement.met ? "bg-green-500" : "bg-gray-300"
                    }`}
                  >
                    {requirement.met && <Check className="w-2 h-2 text-white" />}
                  </div>
                  <span className={requirement.met ? "text-green-600" : "text-muted-foreground"}>
                    {requirement.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
              Confirm Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`pl-10 pr-10 bg-background/50 border-border ${
                  errors.confirmPassword ? "border-destructive" : ""
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-destructive">{errors.confirmPassword}</p>
            )}
          </div>

          <div className="flex space-x-3 mt-6">
            <Button type="button" variant="outline" onClick={onBack} className="flex-1">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button type="submit" variant="default" className="flex-1">
              Continue
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
