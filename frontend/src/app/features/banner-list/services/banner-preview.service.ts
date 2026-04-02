import { inject, Injectable } from "@angular/core";
import type { Banner } from "../../../models/banner.model";
import { BannerImageFileService } from "../../banner-create/services/banner-image-file.service";

@Injectable({ providedIn: "root" })
export class BannerPreviewService {
  private readonly imageFile = inject(BannerImageFileService);

  toPreviewUrl(banner: Banner): string {
    return this.imageFile.dataUrlFromRawBase64(banner.imageBase64);
  }
}
