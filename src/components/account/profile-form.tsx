"use client";

import { AlertCircle, CheckCircle2, Loader2, Mail, Save, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useMemo, useState } from "react";
import type { AccountProfile } from "@/lib/account";
import { createSupabaseBrowserClient, hasSupabaseEnv } from "@/lib/supabase/client";

type ProfileMessage = {
  tone: "error" | "success";
  text: string;
};

const accountUnavailableMessage =
  process.env.NODE_ENV === "production"
    ? "Account access is temporarily unavailable. Please try again later."
    : "Supabase is not configured for this storefront yet.";

export function ProfileForm({ profile }: { profile: AccountProfile }) {
  const router = useRouter();
  const supabase = useMemo(() => (hasSupabaseEnv() ? createSupabaseBrowserClient() : null), []);
  const [firstName, setFirstName] = useState(profile.firstName);
  const [lastName, setLastName] = useState(profile.lastName);
  const [email, setEmail] = useState(profile.email);
  const [message, setMessage] = useState<ProfileMessage | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    if (!supabase) {
      setMessage({ tone: "error", text: accountUnavailableMessage });
      return;
    }

    if (!firstName.trim() || !lastName.trim()) {
      setMessage({ tone: "error", text: "First and last name are required." });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setMessage({ tone: "error", text: "Enter a valid email address." });
      return;
    }

    setSubmitting(true);

    const normalizedFirstName = firstName.trim();
    const normalizedLastName = lastName.trim();
    const normalizedEmail = email.trim();
    const emailChanged = normalizedEmail.toLowerCase() !== profile.email.toLowerCase();

    if (emailChanged) {
      const { error } = await supabase.auth.updateUser(
        { email: normalizedEmail },
        { emailRedirectTo: `${window.location.origin}/auth/callback?next=/account/profile` }
      );

      if (error) {
        setSubmitting(false);
        setMessage({ tone: "error", text: error.message });
        return;
      }
    }

    const { error } = await supabase
      .from("customers")
      .update({
        first_name: normalizedFirstName,
        last_name: normalizedLastName,
        full_name: `${normalizedFirstName} ${normalizedLastName}`.trim(),
        ...(emailChanged ? {} : { email: normalizedEmail }),
        updated_at: new Date().toISOString()
      })
      .eq("id", profile.id);

    setSubmitting(false);

    if (error) {
      setMessage({ tone: "error", text: error.message });
      return;
    }

    setMessage({
      tone: "success",
      text: emailChanged
        ? "Profile saved. Check your new email address to confirm the email change."
        : "Profile saved."
    });
    router.refresh();
  }

  return (
    <form className="grid gap-5" onSubmit={submit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <ProfileField
          icon={UserRound}
          label="First name"
          value={firstName}
          onChange={setFirstName}
          autoComplete="given-name"
        />
        <ProfileField
          icon={UserRound}
          label="Last name"
          value={lastName}
          onChange={setLastName}
          autoComplete="family-name"
        />
      </div>
      <ProfileField
        icon={Mail}
        label="Email"
        value={email}
        onChange={setEmail}
        type="email"
        autoComplete="email"
      />
      <p className="text-xs leading-5 text-[#a9b2aa]">
        Email changes may require confirmation before they appear across your account.
      </p>
      <ProfileMessage message={message} />
      <button
        className="button button-primary w-full disabled:cursor-not-allowed disabled:opacity-55 sm:w-auto"
        disabled={submitting}
        type="submit"
      >
        {submitting ? <Loader2 className="animate-spin" size={17} /> : <Save size={17} />}
        Save profile
      </button>
    </form>
  );
}

function ProfileField({
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
      <span className="flex min-h-12 items-center gap-3 rounded-[10px] border border-[rgba(255,244,215,0.13)] bg-[#09110d] px-3">
        <Icon className="shrink-0 text-[#f4c451]" size={17} />
        <input
          className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none"
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

function ProfileMessage({ message }: { message: ProfileMessage | null }) {
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
