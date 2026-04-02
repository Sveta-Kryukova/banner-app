import type { Banner } from "../../models/banner.model";

export interface BannerCardVm {
  readonly banner: Banner;
  readonly previewUrl: string;
  readonly editPath: string;
}
