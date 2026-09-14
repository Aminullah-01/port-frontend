import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Eye, EyeOff, KeyRound, Mail, CheckCircle2, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { authApi } from "@/api/endpoints";
import { ApiError } from "@/lib/api-client";
import { toast } from "sonner";

function getErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof ApiError) return err.message;
  if (err instanceof Error) return err.message;
  return fallback;
}

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login — Admin" }] }),
  component: LoginPage,
});

function LoginPage() {
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Forgot password modal state
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotStep, setForgotStep] = useState<"request" | "verify">("request");
  const [forgotCode, setForgotCode] = useState("");
  const [forgotNewPw, setForgotNewPw] = useState("");
  const [forgotConfirmPw, setForgotConfirmPw] = useState("");
  const [showForgotNew, setShowForgotNew] = useState(false);
  const [showForgotConfirm, setShowForgotConfirm] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState("");
  const [devCode, setDevCode] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate({ to: "/admin" });
    }
  }, [authLoading, isAuthenticated, navigate]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
      navigate({ to: "/admin" });
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Invalid credentials"));
    } finally {
      setLoading(false);
    }
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError("");
    setDevCode(null);

    if (!forgotEmail.trim()) {
      setForgotError("Please enter your admin email address.");
      return;
    }

    setForgotLoading(true);
    try {
      const res = await authApi.forgotPassword(forgotEmail.trim());
      setForgotStep("verify");
      if (res?.reset_code) {
        setDevCode(res.reset_code);
        setForgotCode(res.reset_code);
      }
      toast.success("Reset code sent! Check your inbox.");
    } catch (err: unknown) {
      const msg = getErrorMessage(err, "Could not find an account with that email.");
      setForgotError(msg);
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError("");

    if (!forgotCode.trim()) {
      setForgotError("Please enter the verification code.");
      return;
    }

    if (forgotNewPw.length < 8) {
      setForgotError("New password must be at least 8 characters.");
      return;
    }

    if (forgotNewPw !== forgotConfirmPw) {
      setForgotError("Passwords do not match.");
      return;
    }

    setForgotLoading(true);
    try {
      await authApi.resetPassword({
        email: forgotEmail.trim(),
        code: forgotCode.trim(),
        password: forgotNewPw,
        password_confirmation: forgotConfirmPw,
      });

      toast.success("Password reset successfully! Logging you in…");
      setEmail(forgotEmail.trim());
      setPassword(forgotNewPw);
      setForgotOpen(false);

      // Log in with the newly reset password
      await login(forgotEmail.trim(), forgotNewPw);
      navigate({ to: "/admin" });
    } catch (err: unknown) {
      const msg = getErrorMessage(err, "Invalid or expired reset code.");
      setForgotError(msg);
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background bg-gradient-hero p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground text-xl font-black shadow-elegant">
            A
          </div>
          <h1 className="mt-4 text-2xl font-black">Admin Login</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to manage your portfolio</p>
        </div>

        <form onSubmit={submit} className="space-y-4 rounded-2xl border bg-card p-6 shadow-soft">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <button
                type="button"
                onClick={() => {
                  setForgotEmail(email);
                  setForgotStep("request");
                  setForgotError("");
                  setForgotOpen(true);
                }}
                className="text-xs text-primary hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPw ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button
            disabled={loading}
            type="submit"
            className="w-full gap-2 bg-gradient-primary text-primary-foreground shadow-elegant"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">
            Back to site
          </Link>
        </p>
      </div>

      {/* Forgot Password Dialog */}
      <Dialog open={forgotOpen} onOpenChange={setForgotOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-primary" />
              Reset Admin Password
            </DialogTitle>
            <DialogDescription>
              {forgotStep === "request"
                ? "Enter your registered admin email address to receive a 6-digit password reset code."
                : "Enter the 6-digit code sent to your email and your new password."}
            </DialogDescription>
          </DialogHeader>

          {forgotStep === "request" ? (
            <form onSubmit={handleSendCode} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="forgot-email">Admin Email</Label>
                <div className="relative">
                  <Input
                    id="forgot-email"
                    type="email"
                    required
                    placeholder="e.g. admin@example.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                  />
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              {forgotError && <p className="text-sm text-destructive">{forgotError}</p>}

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setForgotOpen(false)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={forgotLoading}
                  className="gap-2 bg-gradient-primary text-primary-foreground"
                >
                  {forgotLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ArrowRight className="h-4 w-4" />
                  )}
                  Send Code
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              {devCode && (
                <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-2.5 text-xs text-amber-600 dark:text-amber-400">
                  Verification Code: <strong>{devCode}</strong>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="dialog-code">6-Digit Code</Label>
                  <button
                    type="button"
                    onClick={handleSendCode}
                    disabled={forgotLoading}
                    className="text-xs text-primary hover:underline"
                  >
                    Resend
                  </button>
                </div>
                <Input
                  id="dialog-code"
                  type="text"
                  required
                  maxLength={6}
                  value={forgotCode}
                  onChange={(e) => setForgotCode(e.target.value.trim())}
                  className="font-mono tracking-widest text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dialog-new-pw">New Password</Label>
                <div className="relative">
                  <Input
                    id="dialog-new-pw"
                    type={showForgotNew ? "text" : "password"}
                    required
                    placeholder="Min 8 characters"
                    value={forgotNewPw}
                    onChange={(e) => setForgotNewPw(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowForgotNew((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showForgotNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dialog-confirm-pw">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="dialog-confirm-pw"
                    type={showForgotConfirm ? "text" : "password"}
                    required
                    placeholder="Repeat password"
                    value={forgotConfirmPw}
                    onChange={(e) => setForgotConfirmPw(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowForgotConfirm((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showForgotConfirm ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {forgotError && <p className="text-sm text-destructive">{forgotError}</p>}

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setForgotStep("request")}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  ← Back
                </button>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => setForgotOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={forgotLoading}
                    className="gap-2 bg-gradient-primary text-primary-foreground"
                  >
                    {forgotLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4" />
                    )}
                    Reset & Sign In
                  </Button>
                </div>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
