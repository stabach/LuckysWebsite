import Image from "next/image";
import { cn } from "@/lib/utils";

type LuckyLogoProps = {
  className?: string;
  priority?: boolean;
  sizes?: string;
};

export function LuckyLogo({ className, priority = false, sizes = "56px" }: LuckyLogoProps) {
  return (
    <span className={cn("lucky-logo", className)} aria-hidden="true">
      <Image
        src="/brand/luckys-loot-logo.webp"
        alt=""
        fill
        priority={priority}
        sizes={sizes}
        className="lucky-logo-image"
      />
    </span>
  );
}
