import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/account/auth-forms";
import { AccountPageShell } from "@/components/account/account-ui";
import { getCurrentUser, getSafeRedirectTarget } from "@/lib/account";

export const metadata: Metadata = {
  title: "Customer Login",
  description: "Log in to your Lucky's Loot customer account.",
  robots: { index: false, follow: false }
};

export const dynamic = "force-dynamic";

type LoginPageProps = {
  searchParams: Promise<{ redirectTo?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { redirectTo } = await searchParams;
  const safeRedirect = getSafeRedirectTarget(redirectTo);
  const user = await getCurrentUser();

  if (user) {
    redirect(safeRedirect);
  }

  return (
    <AccountPageShell>
      <LoginForm redirectTo={safeRedirect} />
    </AccountPageShell>
  );
}
