"use client";

import { LogOut, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { createSupabaseBrowserClient, hasSupabaseEnv } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export function SignOutButton({ className }: { className?: string }) {
  const router = useRouter();
  const supabase = useMemo(() => (hasSupabaseEnv() ? createSupabaseBrowserClient() : null), []);
  const [signingOut, setSigningOut] = useState(false);

  async function signOut() {
    if (!supabase) {
      router.push("/login");
      return;
    }

    setSigningOut(true);
    await supabase.auth.signOut();
    setSigningOut(false);
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-[8px] border border-[#d4af37]/32 px-4 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-[#d4af37] transition hover:border-[#d4af37] hover:bg-[#d4af37]/10 disabled:cursor-not-allowed disabled:opacity-60 focus-ring",
        className
      )}
      disabled={signingOut}
      type="button"
      onClick={signOut}
    >
      {signingOut ? <Loader2 className="animate-spin" size={16} /> : <LogOut size={16} />}
      Log out
    </button>
  );
}
