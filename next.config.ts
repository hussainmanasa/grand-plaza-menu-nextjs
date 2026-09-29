import type { NextConfig } from "next";

// "/<repo>" on a GitHub project site, "" locally or on a custom domain.
// Set by .github/workflows/deploy.yml from the GitHub Pages settings.
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");

const nextConfig: NextConfig = {
  // Emit plain HTML/CSS/JS into out/ for GitHub Pages; there is no server.
  output: "export",
  // /golden-ember/ -> out/golden-ember/index.html, which GitHub Pages serves natively.
  trailingSlash: true,
  basePath,
  // next/image optimisation needs a server; menu images are pre-optimised by scripts/build-menus.mjs.
  images: { unoptimized: true },
  reactCompiler: true,
  poweredByHeader: false,
};

export default nextConfig;
