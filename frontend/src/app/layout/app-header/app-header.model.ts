import type { AppPath } from "../../app-paths";
import type { NavLinkRouterActiveOptions } from "../../shared/nav-link/nav-link.types";

export const MaterialSymbol = {
  List: "list",
  AddCircle: "add_circle",
} as const;

export type MaterialSymbolName =
  (typeof MaterialSymbol)[keyof typeof MaterialSymbol];

export type HeaderLinkActiveOptions = NavLinkRouterActiveOptions;

export interface HeaderNavItem {
  readonly label: string;
  readonly path: AppPath;
  readonly icon: MaterialSymbolName;
  readonly routerLinkActiveOptions: HeaderLinkActiveOptions;
}
