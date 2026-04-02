import type { AppButtonVariant } from "../ui-button/app-button.types";

export type NavLinkVariant = "header" | "cta" | "title";

export type NavLinkRouterActiveOptions = Readonly<{ exact: boolean }>;

export const NAV_LINK_ACTIVE_CLASS = "nav-link--active" as const;

export function appButtonVariantForNavLink(
  variant: NavLinkVariant,
): AppButtonVariant {
  return variant === "cta" ? "flat" : "text";
}
