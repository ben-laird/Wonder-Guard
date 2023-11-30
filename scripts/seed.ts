const cwd = new URL("../experiments/prisma-client", import.meta.url);

const script = new Deno.Command("deno", {
  cwd,
  args: ["run", "-A", "prisma/scripts/seed.ts"],
});

script.spawn();
