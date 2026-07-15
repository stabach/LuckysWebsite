import Image from "next/image";
import { cn } from "@/lib/utils";

type NeonSignProps = {
  className?: string;
  eager?: boolean;
  reducedMotion?: boolean;
};

export function NeonSign({ className, eager = false, reducedMotion = false }: NeonSignProps) {
  return (
    <div
      className={cn("neon-sign", reducedMotion && "neon-sign-reduced", className)}
      aria-hidden="true"
    >
      <span className="neon-sign-halo" />
      <Image
        src="/brand/luckys-loot-neon-off.webp"
        alt=""
        fill
        priority={eager}
        sizes="(max-width: 720px) 84vw, 680px"
        className="neon-sign-layer neon-sign-off"
      />
      <Image
        src="/brand/luckys-loot-neon.webp"
        alt=""
        fill
        priority={eager}
        sizes="(max-width: 720px) 84vw, 680px"
        className="neon-sign-layer neon-sign-on"
      />
    </div>
  );
}
