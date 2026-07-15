import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/account/auth-forms";
import { AccountPageShell } from "@/components/account/account-ui";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Send a Lucky's Loot password reset link.",
  robots: { index: false, follow: false }
};

export default function ForgotPasswordPage() {
  return (
    <AccountPageShell>
      <ForgotPasswordForm />
    </AccountPageShell>
  );
}
