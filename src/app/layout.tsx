import type { Metadata, Viewport } from "next";
import { site } from "@/config/site";
import { pageMetadata } from "@/lib/metadata";
import { themeStyle } from "@/lib/theme";
import { siteUrl, withBasePath } from "@/lib/url";
import { bodyFont, condensedFont, serifFont } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  ...pageMetadata({
    title: { absolute: `${site.name} | ${site.tagline}` },
    description: site.description,
    path: "/",
    image: "grand-plaza",
  }),
  metadataBase: new URL(`${siteUrl}/`),
  title: {
    default: `${site.name} | ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  applicationName: site.name,
  // Made from the "GP" symbol of the Grand Plaza logo (public/icon.png, public/touch-icon.png).
  icons: {
    icon: [{ url: withBasePath("/icon.png"), type: "image/png", sizes: "512x512" }],
    apple: withBasePath("/touch-icon.png"),
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false, address: false, email: false },
  ...(site.googleSiteVerification ? { verification: { google: site.googleSiteVerification } } : {}),
};

export const viewport: Viewport = {
  themeColor: site.theme.colors.background,
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang={site.language}
      style={themeStyle(site.theme)}
      className={`${bodyFont.variable} ${serifFont.variable} ${condensedFont.variable} antialiased`}
    >
      <body className="min-h-dvh bg-background font-sans text-foreground">{children}</body>
    </html>
  );
}
