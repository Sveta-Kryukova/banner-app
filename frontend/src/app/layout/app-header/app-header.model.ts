import type { AppPath } from "../../app-paths";

export const MaterialSymbol = {
  List: "list",
  AddCircle: "add_circle",
} as const;

export type MaterialSymbolName =
  (typeof MaterialSymbol)[keyof typeof MaterialSymbol];

export type HeaderLinkActiveOptions = Readonly<{ exact: boolean }>;

export interface HeaderNavItem {
  readonly label: string;
  readonly path: AppPath;
  readonly icon: MaterialSymbolName;
  readonly routerLinkActiveOptions: HeaderLinkActiveOptions;
}
