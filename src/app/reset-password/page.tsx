import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/account/auth-forms";
import { AccountPageShell } from "@/components/account/account-ui";

export const metadata: Metadata = {
  title: "New Password",
  description: "Set a new Lucky's Loot customer account password."
};

export const dynamic = "force-dynamic";

export default function ResetPasswordPage() {
  return (
    <AccountPageShell>
      <ResetPasswordForm />
    </AccountPageShell>
  );
}
