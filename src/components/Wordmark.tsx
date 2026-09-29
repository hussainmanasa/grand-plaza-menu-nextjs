import type { Theme } from "@/config/types";
import { displayClass } from "@/lib/theme";
import { withBasePath } from "@/lib/url";

type Props = {
  name: string;
  logo?: string;
  theme: Theme;
  className?: string;
};

/** The configured logo image, or the name set in the theme's display font. */
export function Wordmark({ name, logo, theme, className = "" }: Props) {
  if (logo) {
    // eslint-disable-next-line @next/next/no-img-element -- static export; logo is already optimised
    return <img src={withBasePath(logo)} alt={name} className={`mx-auto h-auto max-h-24 w-auto ${className}`} />;
  }
  return <span className={`${displayClass(theme)} ${className}`}>{name}</span>;
}
