import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SignUpForm } from "@/components/account/auth-forms";
import { AccountPageShell } from "@/components/account/account-ui";
import { getCurrentUser, getSafeRedirectTarget } from "@/lib/account";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create a Lucky's Loot customer account.",
  robots: { index: false, follow: false }
};

export const dynamic = "force-dynamic";

type SignUpPageProps = {
  searchParams: Promise<{ redirectTo?: string }>;
};

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const { redirectTo } = await searchParams;
  const safeRedirect = getSafeRedirectTarget(redirectTo);
  const user = await getCurrentUser();

  if (user) {
    redirect(safeRedirect);
  }

  return (
    <AccountPageShell>
      <SignUpForm redirectTo={safeRedirect} />
    </AccountPageShell>
  );
}
