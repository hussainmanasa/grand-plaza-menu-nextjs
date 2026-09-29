import { ImageResponse } from "next/og";
import { site } from "@/config/site";

export const dynamic = "force-static";

// iOS "Add to Home Screen" icon (180×180); mirrors src/app/icon.svg.
export function GET() {
  const c = site.theme.colors;
  const monogram = site.name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: c.background,
          color: c.accent,
          fontSize: 76,
          letterSpacing: 2,
        }}
      >
        {monogram}
      </div>
    ),
    { width: 180, height: 180 },
  );
}
