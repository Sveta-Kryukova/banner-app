import type { AppButtonVariant } from "../ui-button/app-button.types";

export type NavLinkVariant = "header" | "cta" | "title";

/** Subset passed to `RouterLinkActive` — shared with header nav config (DRY). */
export type NavLinkRouterActiveOptions = Readonly<{ exact: boolean }>;

export const NAV_LINK_ACTIVE_CLASS = "nav-link--active" as const;

/** CTA uses filled Material button; header/title use text button. */
export function appButtonVariantForNavLink(
  variant: NavLinkVariant,
): AppButtonVariant {
  return variant === "cta" ? "flat" : "text";
}
