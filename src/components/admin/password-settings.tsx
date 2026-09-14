import { useState } from "react";
import {
  KeyRound,
  Eye,
  EyeOff,
  Loader2,
  Mail,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authApi } from "@/api/endpoints";
import { ApiError } from "@/lib/api-client";
import { useAuth } from "@/contexts/auth-context";

function getErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof ApiError) return err.message;
  if (err instanceof Error) return err.message;
  return fallback;
}

export function PasswordSettings() {
  const { user } = useAuth();
  const [mode, setMode] = useState<"change" | "forgot">("change");

  // Change Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [changeLoading, setChangeLoading] = useState(false);
  const [changeError, setChangeError] = useState("");

  // Forgot Password / Reset state
  const [resetEmail, setResetEmail] = useState(user?.email || "");
  const [resetStep, setResetStep] = useState<"request" | "verify">("request");
  const [resetCode, setResetCode] = useState("");
  const [resetNewPassword, setResetNewPassword] = useState("");
  const [resetConfirmPassword, setResetConfirmPassword] = useState("");
  const [showResetNew, setShowResetNew] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState("");
  const [devCode, setDevCode] = useState<string | null>(null);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangeError("");

    if (newPassword.length < 8) {
      setChangeError("New password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setChangeError("New passwords do not match.");
      return;
    }

    setChangeLoading(true);
    try {
      await authApi.changePassword({
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
      });

      toast.success("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      const msg = getErrorMessage(err, "Failed to update password. Verify your current password.");
      setChangeError(msg);
      toast.error(msg);
    } finally {
      setChangeLoading(false);
    }
  };

  const handleSendResetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError("");
    setDevCode(null);

    const emailToSend = resetEmail.trim() || user?.email;
    if (!emailToSend) {
      setResetError("Please provide an email address.");
      return;
    }

    setResetLoading(true);
    try {
      const res = await authApi.forgotPassword(emailToSend);
      setResetStep("verify");
      if (res?.reset_code) {
        setDevCode(res.reset_code);
        setResetCode(res.reset_code);
      }
      toast.success("Reset code sent! Check your inbox.");
    } catch (err: unknown) {
      const msg = getErrorMessage(
        err,
        "Failed to send reset code. Please check the email address.",
      );
      setResetError(msg);
      toast.error(msg);
    } finally {
      setResetLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError("");

    if (!resetCode.trim()) {
      setResetError("Please enter the 6-digit reset code.");
      return;
    }

    if (resetNewPassword.length < 8) {
      setResetError("New password must be at least 8 characters.");
      return;
    }

    if (resetNewPassword !== resetConfirmPassword) {
      setResetError("Passwords do not match.");
      return;
    }

    setResetLoading(true);
    try {
      const emailToSend = resetEmail.trim() || user?.email || "";
      await authApi.resetPassword({
        email: emailToSend,
        code: resetCode.trim(),
        password: resetNewPassword,
        password_confirmation: resetConfirmPassword,
      });

      toast.success("Password has been reset successfully!");
      setMode("change");
      setResetStep("request");
      setResetCode("");
      setResetNewPassword("");
      setResetConfirmPassword("");
      setDevCode(null);
    } catch (err: unknown) {
      const msg = getErrorMessage(err, "Failed to reset password. Please check the reset code.");
      setResetError(msg);
      toast.error(msg);
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-soft">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <h3 className="font-bold text-lg">Security & Authentication</h3>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Manage your admin account credentials and recovery settings.
          </p>
        </div>

        <div className="flex items-center gap-1 rounded-xl bg-muted/60 p-1 self-start sm:self-auto text-xs">
          <button
            type="button"
            onClick={() => {
              setMode("change");
              setChangeError("");
            }}
            className={`rounded-lg px-3 py-1.5 font-medium transition-all ${
              mode === "change"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Change Password
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("forgot");
              setResetError("");
              setResetEmail(user?.email || "");
            }}
            className={`rounded-lg px-3 py-1.5 font-medium transition-all ${
              mode === "forgot"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Forgot Password
          </button>
        </div>
      </div>

      {mode === "change" ? (
        <form onSubmit={handleChangePassword} className="mt-5 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="current-pw">Current Password</Label>
              <button
                type="button"
                onClick={() => {
                  setMode("forgot");
                  setResetEmail(user?.email || "");
                }}
                className="text-xs text-primary hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Input
                id="current-pw"
                type={showCurrent ? "text" : "password"}
                required
                placeholder="Enter your current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowCurrent((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="new-pw">New Password</Label>
              <div className="relative">
                <Input
                  id="new-pw"
                  type={showNew ? "text" : "password"}
                  required
                  placeholder="At least 8 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowNew((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-pw">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirm-pw"
                  type={showConfirm ? "text" : "password"}
                  required
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          {changeError && (
            <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
              {changeError}
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-muted-foreground">
              Must be at least 8 characters long.
            </span>
            <Button
              type="submit"
              disabled={changeLoading}
              className="gap-2 bg-gradient-primary text-primary-foreground shadow-elegant"
            >
              {changeLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <KeyRound className="h-4 w-4" />
              )}
              {changeLoading ? "Updating…" : "Update Password"}
            </Button>
          </div>
        </form>
      ) : (
        <div className="mt-5 space-y-4">
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-xs text-muted-foreground">
            <p className="font-medium text-foreground">Forgot or want to reset your password?</p>
            <p className="mt-1">
              Request a 6-digit verification code to your registered admin email (
              {user?.email || "admin email"}) and set a brand new password without needing the
              current one.
            </p>
          </div>

          {resetStep === "request" ? (
            <form onSubmit={handleSendResetCode} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email">Admin Email Address</Label>
                <div className="relative">
                  <Input
                    id="reset-email"
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="Enter admin email"
                  />
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              {resetError && (
                <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
                  {resetError}
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setMode("change")}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  ← Back to Change Password
                </button>
                <Button
                  type="submit"
                  disabled={resetLoading}
                  className="gap-2 bg-gradient-primary text-primary-foreground shadow-elegant"
                >
                  {resetLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ArrowRight className="h-4 w-4" />
                  )}
                  {resetLoading ? "Sending Code…" : "Send Reset Code"}
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              {devCode && (
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-600 dark:text-amber-400">
                  <strong>Verification Code:</strong> {devCode} (automatically filled for testing)
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="reset-code">6-Digit Verification Code</Label>
                  <button
                    type="button"
                    onClick={handleSendResetCode}
                    disabled={resetLoading}
                    className="text-xs text-primary hover:underline"
                  >
                    Resend code
                  </button>
                </div>
                <Input
                  id="reset-code"
                  type="text"
                  required
                  maxLength={6}
                  placeholder="e.g. 123456"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value.trim())}
                  className="font-mono tracking-widest text-base"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="reset-new-pw">New Password</Label>
                  <div className="relative">
                    <Input
                      id="reset-new-pw"
                      type={showResetNew ? "text" : "password"}
                      required
                      placeholder="At least 8 characters"
                      value={resetNewPassword}
                      onChange={(e) => setResetNewPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowResetNew((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showResetNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reset-confirm-pw">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="reset-confirm-pw"
                      type={showResetConfirm ? "text" : "password"}
                      required
                      placeholder="Repeat new password"
                      value={resetConfirmPassword}
                      onChange={(e) => setResetConfirmPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowResetConfirm((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showResetConfirm ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {resetError && (
                <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
                  {resetError}
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setResetStep("request")}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  ← Back to Email
                </button>
                <Button
                  type="submit"
                  disabled={resetLoading}
                  className="gap-2 bg-gradient-primary text-primary-foreground shadow-elegant"
                >
                  {resetLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                  {resetLoading ? "Resetting…" : "Reset & Save Password"}
                </Button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
