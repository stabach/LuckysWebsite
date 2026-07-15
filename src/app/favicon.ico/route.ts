import { readFile } from "node:fs/promises";
import { join } from "node:path";

export async function GET() {
  const icon = await readFile(
    join(process.cwd(), "public", "brand", "luckys-loot-mark-192.png")
  );

  return new Response(icon, {
    headers: {
      "cache-control": "public, max-age=31536000, immutable",
      "content-type": "image/png"
    }
  });
}
