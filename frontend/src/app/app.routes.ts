import { Routes } from "@angular/router";
import { from } from "rxjs";
import { map } from "rxjs/operators";
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
      from(import("./features/banner-list/banner-list-page.component")).pipe(
        map((m) => m.BannerListPageComponent),
      ),
  },
  {
    path: APP_ROUTE_SEGMENTS.bannersNew,
    loadComponent: () =>
      from(
        import("./features/banner-create/banner-create-page.component"),
      ).pipe(map((m) => m.BannerCreatePageComponent)),
  },
  {
    path: APP_ROUTE_BANNER_EDIT_PATTERN,
    loadComponent: () =>
      from(
        import("./features/banner-create/banner-create-page.component"),
      ).pipe(map((m) => m.BannerCreatePageComponent)),
  },
  { path: "**", redirectTo: APP_ROUTE_SEGMENTS.banners },
];
