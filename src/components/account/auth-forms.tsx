"use client";

import { AlertCircle, CheckCircle2, Loader2, LockKeyhole, Mail, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, type ReactNode, useMemo, useState } from "react";
import { createSupabaseBrowserClient, hasSupabaseEnv } from "@/lib/supabase/client";

type AuthFormProps = {
  redirectTo?: string;
};

type Message = {
  tone: "error" | "success";
  text: string;
};

const accountUnavailableMessage =
  process.env.NODE_ENV === "production"
    ? "Account access is temporarily unavailable. Guest checkout remains available."
    : "Supabase is not configured for this storefront yet.";

export function LoginForm({ redirectTo = "/account" }: AuthFormProps) {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<Message | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    if (!supabase) {
      setMessage({ tone: "error", text: accountUnavailableMessage });
      return;
    }

    if (!isValidEmail(email) || !password) {
      setMessage({ tone: "error", text: "Enter a valid email and password to continue." });
      return;
    }

    setSubmitting(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password
    });

    setSubmitting(false);

    if (error) {
      setMessage({
        tone: "error",
        text: "That email and password did not match a customer account."
      });
      return;
    }

    router.push(redirectTo);
    router.refresh();
  }

  return (
    <AuthCard eyebrow="Customer login" title="Welcome back.">
      <form className="mt-8 grid gap-4" onSubmit={submit}>
        <AuthInput
          icon={Mail}
          label="Email"
          value={email}
          onChange={setEmail}
          type="email"
          autoComplete="email"
        />
        <AuthInput
          icon={LockKeyhole}
          label="Password"
          value={password}
          onChange={setPassword}
          type="password"
          autoComplete="current-password"
        />
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
          <Link className="text-[#f4c451] transition hover:text-[#fff3d6] focus-ring" href="/forgot-password">
            Forgot password?
          </Link>
          <Link className="text-[#a9b2aa] transition hover:text-white focus-ring" href="/sign-up">
            Create account
          </Link>
        </div>
        <AuthMessage message={message} />
        <AuthSubmitButton busy={submitting} label="Log in" />
      </form>
    </AuthCard>
  );
}

export function SignUpForm({ redirectTo = "/account" }: AuthFormProps) {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<Message | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    if (!supabase) {
      setMessage({ tone: "error", text: accountUnavailableMessage });
      return;
    }

    const validationError = validateSignUp({
      firstName,
      lastName,
      email,
      password,
      confirmPassword
    });

    if (validationError) {
      setMessage({ tone: "error", text: validationError });
      return;
    }

    setSubmitting(true);

    const origin = window.location.origin;
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
        data: {
          first_name: firstName.trim(),
          last_name: lastName.trim()
        }
      }
    });

    setSubmitting(false);

    if (error) {
      setMessage({
        tone: "error",
        text: error.message.toLowerCase().includes("already")
          ? "An account already exists for that email. Try logging in instead."
          : error.message
      });
      return;
    }

    if (data.session) {
      router.push(redirectTo);
      router.refresh();
      return;
    }

    setMessage({
      tone: "success",
      text: "Check your email to confirm your account, then come back to view your orders."
    });
  }

  return (
    <AuthCard eyebrow="New customer" title="Create your account.">
      <form className="mt-8 grid gap-4" onSubmit={submit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <AuthInput
            icon={UserRound}
            label="First name"
            value={firstName}
            onChange={setFirstName}
            autoComplete="given-name"
          />
          <AuthInput
            icon={UserRound}
            label="Last name"
            value={lastName}
            onChange={setLastName}
            autoComplete="family-name"
          />
        </div>
        <AuthInput
          icon={Mail}
          label="Email"
          value={email}
          onChange={setEmail}
          type="email"
          autoComplete="email"
        />
        <AuthInput
          icon={LockKeyhole}
          label="Password"
          value={password}
          onChange={setPassword}
          type="password"
          autoComplete="new-password"
        />
        <AuthInput
          icon={LockKeyhole}
          label="Confirm password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          type="password"
          autoComplete="new-password"
        />
        <p className="text-xs leading-5 text-[#a9b2aa]">
          Use at least 8 characters with letters and numbers.
        </p>
        <AuthMessage message={message} />
        <AuthSubmitButton busy={submitting} label="Sign up" />
        <p className="text-center text-sm text-[#a9b2aa]">
          Already have an account?{" "}
          <Link className="text-[#f4c451] transition hover:text-[#fff3d6] focus-ring" href="/login">
            Log in
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}

export function ForgotPasswordForm() {
  const supabase = useSupabaseClient();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<Message | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    if (!supabase) {
      setMessage({ tone: "error", text: accountUnavailableMessage });
      return;
    }

    if (!isValidEmail(email)) {
      setMessage({ tone: "error", text: "Enter the email address for your customer account." });
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`
    });
    setSubmitting(false);

    if (error) {
      setMessage({ tone: "error", text: error.message });
      return;
    }

    setMessage({
      tone: "success",
      text: "If that email has an account, a reset link is on the way."
    });
  }

  return (
    <AuthCard eyebrow="Password reset" title="Reset your password.">
      <form className="mt-8 grid gap-4" onSubmit={submit}>
        <AuthInput
          icon={Mail}
          label="Email"
          value={email}
          onChange={setEmail}
          type="email"
          autoComplete="email"
        />
        <AuthMessage message={message} />
        <AuthSubmitButton busy={submitting} label="Send reset link" />
        <Link className="text-center text-sm text-[#f4c451] transition hover:text-[#fff3d6] focus-ring" href="/login">
          Back to login
        </Link>
      </form>
    </AuthCard>
  );
}

export function ResetPasswordForm() {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<Message | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    if (!supabase) {
      setMessage({ tone: "error", text: accountUnavailableMessage });
      return;
    }

    if (!isStrongPassword(password)) {
      setMessage({ tone: "error", text: "Password must be at least 8 characters with letters and numbers." });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({ tone: "error", text: "Password confirmation does not match." });
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSubmitting(false);

    if (error) {
      setMessage({
        tone: "error",
        text: "Use the reset link from your email, then enter your new password here."
      });
      return;
    }

    setMessage({ tone: "success", text: "Password updated. Taking you to your account." });
    router.push("/account");
    router.refresh();
  }

  return (
    <AuthCard eyebrow="New password" title="Secure your account.">
      <form className="mt-8 grid gap-4" onSubmit={submit}>
        <AuthInput
          icon={LockKeyhole}
          label="New password"
          value={password}
          onChange={setPassword}
          type="password"
          autoComplete="new-password"
        />
        <AuthInput
          icon={LockKeyhole}
          label="Confirm new password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          type="password"
          autoComplete="new-password"
        />
        <AuthMessage message={message} />
        <AuthSubmitButton busy={submitting} label="Update password" />
      </form>
    </AuthCard>
  );
}

function AuthCard({
  eyebrow,
  title,
  children
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mx-auto w-full max-w-xl rounded-[24px] border border-[rgba(255,244,215,0.13)] bg-[#0d1712] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.34)] sm:p-8">
      <p className="text-[0.68rem] font-bold uppercase leading-6 tracking-[0.14em] text-[#f4c451]">{eyebrow}</p>
      <h1 className="mt-4 text-3xl font-bold tracking-[-0.04em] text-[#fffaf0] sm:text-4xl">{title}</h1>
      <p className="mt-4 text-sm leading-6 text-[#a9b2aa]">
        Access orders, pickup details, and account updates from one customer dashboard.
      </p>
      {children}
    </section>
  );
}

function AuthInput({
  icon: Icon,
  label,
  value,
  onChange,
  type = "text",
  autoComplete
}: {
  icon: typeof Mail;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <label className="grid gap-2 text-sm text-[#fff3d6]">
      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#a9b2aa]">{label}</span>
      <span className="flex min-h-12 items-center gap-3 rounded-[10px] border border-[rgba(255,244,215,0.13)] bg-[#09110d] px-3 transition-within">
        <Icon className="shrink-0 text-[#f4c451]" size={17} />
        <input
          className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-[#68736b]"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          type={type}
          autoComplete={autoComplete}
          required
        />
      </span>
    </label>
  );
}

function AuthMessage({ message }: { message: Message | null }) {
  if (!message) {
    return null;
  }

  const Icon = message.tone === "success" ? CheckCircle2 : AlertCircle;

  return (
    <div
      className={
        message.tone === "success"
          ? "flex gap-2 rounded-[8px] border border-emerald-400/25 bg-emerald-400/10 p-3 text-sm leading-6 text-emerald-100"
          : "flex gap-2 rounded-[10px] border border-[#fa6873]/30 bg-[#de4e53]/10 p-3 text-sm leading-6 text-[#fee9c9]"
      }
    >
      <Icon className="mt-0.5 shrink-0" size={16} />
      <span>{message.text}</span>
    </div>
  );
}

function AuthSubmitButton({ busy, label }: { busy: boolean; label: string }) {
  return (
    <button
      className="button button-primary w-full disabled:cursor-not-allowed disabled:opacity-55"
      disabled={busy}
      type="submit"
    >
      {busy ? <Loader2 className="animate-spin" size={17} /> : <LockKeyhole size={17} />}
      {label}
    </button>
  );
}

function useSupabaseClient() {
  return useMemo(() => {
    if (!hasSupabaseEnv()) {
      return null;
    }

    return createSupabaseBrowserClient();
  }, []);
}

function validateSignUp(values: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}) {
  if (!values.firstName.trim() || !values.lastName.trim()) {
    return "Enter your first and last name.";
  }

  if (!isValidEmail(values.email)) {
    return "Enter a valid email address.";
  }

  if (!isStrongPassword(values.password)) {
    return "Password must be at least 8 characters with letters and numbers.";
  }

  if (values.password !== values.confirmPassword) {
    return "Password confirmation does not match.";
  }

  return null;
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function isStrongPassword(value: string) {
  return value.length >= 8 && /[a-z]/i.test(value) && /\d/.test(value);
}
