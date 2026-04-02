import { Routes } from "@angular/router";
import { APP_ROUTE_BANNER_EDIT_PATTERN, APP_ROUTE_SEGMENTS } from "./app-paths";

export const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: APP_ROUTE_SEGMENTS.banners,
  },
  {
    path: APP_ROUTE_SEGMENTS.banners,
    loadComponent: () =>
      import("./features/banner-list/banner-list-page.component").then(
        (m) => m.BannerListPageComponent,
      ),
  },
  {
    path: APP_ROUTE_SEGMENTS.bannersNew,
    loadComponent: () =>
      import("./features/banner-create/banner-create-page.component").then(
        (m) => m.BannerCreatePageComponent,
      ),
  },
  {
    path: APP_ROUTE_BANNER_EDIT_PATTERN,
    loadComponent: () =>
      import("./features/banner-create/banner-create-page.component").then(
        (m) => m.BannerCreatePageComponent,
      ),
  },
  { path: "**", redirectTo: APP_ROUTE_SEGMENTS.banners },
];
