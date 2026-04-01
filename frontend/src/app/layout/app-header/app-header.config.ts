import { APP_PATH } from "../../app-paths";
import {
  MaterialSymbol,
  type HeaderLinkActiveOptions,
  type HeaderNavItem,
} from "./app-header.model";

const ROUTER_ACTIVE_EXACT: HeaderLinkActiveOptions = { exact: true };
const ROUTER_ACTIVE_PREFIX: HeaderLinkActiveOptions = { exact: false };

export const HEADER_UI = {
  appTitle: "Banner App",
  mainNavAriaLabel: "Main navigation",
} as const;

export const HEADER_NAV_ITEMS: readonly HeaderNavItem[] = [
  {
    label: "List",
    path: APP_PATH.banners,
    icon: MaterialSymbol.List,
    routerLinkActiveOptions: ROUTER_ACTIVE_EXACT,
  },
  {
    label: "Create",
    path: APP_PATH.bannersNew,
    icon: MaterialSymbol.AddCircle,
    routerLinkActiveOptions: ROUTER_ACTIVE_PREFIX,
  },
];
