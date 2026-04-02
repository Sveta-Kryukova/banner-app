export const APP_ROUTE_SEGMENTS = {
  banners: "banners",
  bannersNew: "banners/new",
} as const;

export const APP_ROUTE_BANNER_EDIT_PATTERN =
  `${APP_ROUTE_SEGMENTS.banners}/:bannerId/edit` as const;

export const APP_PATH = {
  banners: `/${APP_ROUTE_SEGMENTS.banners}`,
  bannersNew: `/${APP_ROUTE_SEGMENTS.bannersNew}`,
} as const;

export type AppPath = (typeof APP_PATH)[keyof typeof APP_PATH];

export function bannerEditPath(id: number): string {
  return `/banners/${id}/edit`;
}
