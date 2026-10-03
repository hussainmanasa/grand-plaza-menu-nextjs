import type { NextConfig } from "next";

// Only needed when hosting under a sub-path (e.g. "/menu"); empty otherwise.
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");

const nextConfig: NextConfig = {
  // Plain HTML/CSS/JS in out/; no server needed (Vercel serves it as a static site).
  output: "export",
  // /golden-ember/ -> out/golden-ember/index.html, served at /golden-ember/.
  trailingSlash: true,
  basePath,
  // next/image optimisation needs a server; menu images are pre-optimised by scripts/build-menus.mjs.
  images: { unoptimized: true },
  reactCompiler: true,
  poweredByHeader: false,
};

export default nextConfig;
