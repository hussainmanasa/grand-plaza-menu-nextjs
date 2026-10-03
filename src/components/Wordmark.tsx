import type { Logo, Theme } from "@/config/types";
import { displayClass } from "@/lib/theme";
import { withBasePath } from "@/lib/url";

type Props = {
  name: string;
  logo?: Logo;
  theme: Theme;
  className?: string;
  /** Logo size, e.g. "w-[min(100%,18rem)] max-h-28". Ignored for the text wordmark. */
  logoClassName?: string;
};

/** The configured logo image, or the name set in the theme's display font. */
export function Wordmark({ name, logo, theme, className = "", logoClassName = "w-auto max-h-24 max-w-full" }: Props) {
  if (logo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- static export; logo is already optimised
      <img
        src={withBasePath(logo.src)}
        width={logo.width}
        height={logo.height}
        alt={name}
        className={`block h-auto object-contain ${logoClassName} ${className}`}
      />
    );
  }
  return <span className={`${displayClass(theme)} ${className}`}>{name}</span>;
}
