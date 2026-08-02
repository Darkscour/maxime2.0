import { spawn, execSync } from "node:child_process";
import { existsSync, readdirSync, rmSync, statSync } from "node:fs";
import { createServer } from "node:net";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const port = Number(process.env.PORT || 3000);
const CACHE_LIMIT_MB = 500;

function dirSizeBytes(dir) {
  let total = 0;
  const walk = (path) => {
    for (const entry of readdirSync(path, { withFileTypes: true })) {
      const full = join(path, entry.name);
      try {
        if (entry.isDirectory()) walk(full);
        else total += statSync(full).size;
      } catch {
        // Ignore files removed while walking.
      }
    }
  };
  try {
    walk(dir);
  } catch {
    return 0;
  }
  return total;
}

function pruneTurbopackIfHuge() {
  const cache = join(root, ".next", "dev", "cache", "turbopack");
  if (!existsSync(cache)) return;
  const mb = dirSizeBytes(cache) / (1024 * 1024);
  if (mb <= CACHE_LIMIT_MB) return;
  console.log(
    `Clearing oversized Turbopack cache (${mb.toFixed(0)} MB) so the first page load is not stuck...`,
  );
  rmSync(cache, { recursive: true, force: true });
}

function canListen(listenPort) {
  return new Promise((resolve) => {
    const server = createServer();
    server.unref();
    server.once("error", () => resolve(false));
    server.once("listening", () => {
      server.close(() => resolve(true));
    });
    server.listen(listenPort, "0.0.0.0");
  });
}

function listeningPids(listenPort) {
  if (process.platform === "win32") {
    try {
      const out = execSync(`netstat -ano | findstr :${listenPort}`, {
        encoding: "utf8",
      });
      const pids = new Set();
      for (const line of out.split(/\r?\n/)) {
        if (!/LISTENING/i.test(line)) continue;
        const parts = line.trim().split(/\s+/);
        const pid = parts.at(-1);
        if (pid && /^\d+$/.test(pid) && pid !== String(process.pid)) {
          pids.add(pid);
        }
      }
      return [...pids];
    } catch {
      return [];
    }
  }

  try {
    const out = execSync(`lsof -ti tcp:${listenPort} -sTCP:LISTEN`, {
      encoding: "utf8",
    });
    return out
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((pid) => /^\d+$/.test(pid) && pid !== String(process.pid));
  } catch {
    return [];
  }
}

async function freePort(listenPort) {
  if (await canListen(listenPort)) return;

  const pids = listeningPids(listenPort);
  if (pids.length === 0) {
    console.warn(
      `Port ${listenPort} looks busy, but no owning process was found. Waiting briefly...`,
    );
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return;
  }

  console.log(
    `Port ${listenPort} is busy (PID ${pids.join(", ")}). Stopping stale process so the site can bind on the first try...`,
  );
  for (const pid of pids) {
    try {
      if (process.platform === "win32") {
        execSync(`taskkill /PID ${pid} /F /T`, { stdio: "ignore" });
      } else {
        process.kill(Number(pid), "SIGKILL");
      }
    } catch {
      // Process may already have exited.
    }
  }
  await new Promise((resolve) => setTimeout(resolve, 800));
}

function warmHomepage(child) {
  const url = `http://127.0.0.1:${port}/`;
  let attempts = 0;
  let settled = false;

  const tick = async () => {
    if (settled || child.exitCode != null) return;
    attempts += 1;
    try {
      const res = await fetch(url, { redirect: "follow" });
      // First compile can briefly return errors; keep retrying until healthy.
      if (res.status >= 500) {
        if (attempts < 90) setTimeout(tick, 750);
        return;
      }
      await res.arrayBuffer();
      settled = true;
      console.log(
        `Prefetched ${url} (${res.status}) — first browser open should be warm.`,
      );
    } catch {
      if (attempts < 90) setTimeout(tick, 750);
    }
  };

  setTimeout(tick, 1500);
}

async function main() {
  pruneTurbopackIfHuge();
  await freePort(port);

  const nextBin = join(root, "node_modules", "next", "dist", "bin", "next");
  const args = existsSync(nextBin)
    ? [nextBin, "dev", "--port", String(port)]
    : ["next", "dev", "--port", String(port)];
  const command = existsSync(nextBin)
    ? process.execPath
    : process.platform === "win32"
      ? "npx.cmd"
      : "npx";

  const child = spawn(command, args, {
    cwd: root,
    stdio: "inherit",
    env: process.env,
    shell: command.endsWith(".cmd"),
  });

  warmHomepage(child);

  const shutdown = () => {
    if (!child.killed) child.kill("SIGTERM");
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  child.on("exit", (code, signal) => {
    if (signal) process.exit(0);
    process.exit(code ?? 0);
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
