import { readFile } from "node:fs/promises";
import { join } from "node:path";

export async function GET() {
  const icon = await readFile(join(process.cwd(), "public", "old-site", "luckysloot-favicon.ico"));

  return new Response(icon, {
    headers: {
      "cache-control": "public, max-age=31536000, immutable",
      "content-type": "image/x-icon"
    }
  });
}
