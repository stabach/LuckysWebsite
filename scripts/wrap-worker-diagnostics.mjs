import { copyFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const outputDirectory = resolve(".open-next");
const workerPath = resolve(outputDirectory, "worker.js");
const originalWorkerPath = resolve(outputDirectory, "worker.original.js");

await copyFile(workerPath, originalWorkerPath);
await writeFile(
  workerPath,
  `import worker from "./worker.original.js";
export * from "./worker.original.js";

export default {
  async fetch(request, env, ctx) {
    try {
      return await worker.fetch(request, env, ctx);
    } catch (error) {
      const details =
        error instanceof Error
          ? \`\${error.name}: \${error.message}\\n\${error.stack ?? ""}\`
          : String(error);

      console.error("Lucky's Loot deployment exception", details);

      return new Response(details, {
        status: 500,
        headers: {
          "content-type": "text/plain; charset=UTF-8",
          "cache-control": "no-store"
        }
      });
    }
  }
};
`
);
