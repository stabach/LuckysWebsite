import { execFile } from "node:child_process";
import { copyFile, rm } from "node:fs/promises";
import { resolve } from "node:path";
import { promisify } from "node:util";

const execute = promisify(execFile);
const outputDirectory = resolve(".open-next", "bundled");
const wranglerBinary = resolve("node_modules", ".bin", "wrangler");

await rm(outputDirectory, { recursive: true, force: true });

const { stdout, stderr } = await execute(
  wranglerBinary,
  ["deploy", "--dry-run", "--outdir", outputDirectory],
  { maxBuffer: 10 * 1024 * 1024 }
);

if (stdout) {
  process.stdout.write(stdout);
}

if (stderr) {
  process.stderr.write(stderr);
}

await copyFile(
  resolve(outputDirectory, "worker.js"),
  resolve(".open-next", "worker.js")
);
await rm(outputDirectory, { recursive: true, force: true });
