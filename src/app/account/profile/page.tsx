import type { Metadata } from "next";
import {
  AccountHero,
  AccountPageShell,
  AccountTabs,
  AuthSetupNotice,
  DetailLine,
  DetailPanel
} from "@/components/account/account-ui";
import { ProfileForm } from "@/components/account/profile-form";
import { SignOutButton } from "@/components/account/sign-out-button";
import { getRequiredAccountSession } from "@/lib/account";

export const metadata: Metadata = {
  title: "Profile",
  description: "Manage your Lucky's Loot customer profile.",
  robots: { index: false, follow: false }
};

export const dynamic = "force-dynamic";

export default async function AccountProfilePage() {
  const session = await getRequiredAccountSession("/account/profile");

  if (session.missingEnv) {
    return <AuthSetupNotice />;
  }

  return (
    <AccountPageShell>
      <AccountHero
        profile={session.profile}
        eyebrow="Profile"
        title="Manage account info."
        description="Keep your name and email ready for future order updates."
      >
        <SignOutButton />
      </AccountHero>
      <AccountTabs current="profile" />

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="rounded-[16px] border border-[rgba(255,244,215,0.13)] bg-[#0d1712] p-5">
          <h2 className="text-xl font-semibold text-white">Basic information</h2>
          <div className="mt-5">
            <ProfileForm profile={session.profile} />
          </div>
        </section>

        <DetailPanel title="Account overview">
          <DetailLine label="Email" value={session.profile.email} />
          <DetailLine label="Created" value={session.profile.createdAt?.slice(0, 10)} />
        </DetailPanel>
      </div>
    </AccountPageShell>
  );
}
