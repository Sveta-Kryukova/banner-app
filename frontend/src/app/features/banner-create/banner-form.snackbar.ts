import { inject, Injectable } from "@angular/core";
import { BANNER_FORM_COPY } from "./banner-create.constants";
import { AppToastService } from "../../shared/app-toast/app-toast.service";

export type BannerFormSnackKind =
  | "created"
  | "updated"
  | "createError"
  | "updateError"
  | "notFound";

const SNACK_BY_KIND: Record<
  BannerFormSnackKind,
  { message: string; duration: number }
> = {
  created: {
    message: BANNER_FORM_COPY.snackCreated,
    duration: 4000,
  },
  updated: {
    message: BANNER_FORM_COPY.snackUpdated,
    duration: 4000,
  },
  createError: {
    message: BANNER_FORM_COPY.snackCreateError,
    duration: 6000,
  },
  updateError: {
    message: BANNER_FORM_COPY.snackUpdateError,
    duration: 6000,
  },
  notFound: {
    message: BANNER_FORM_COPY.notFoundSnack,
    duration: 4000,
  },
};

@Injectable()
export class BannerFormSnackBar {
  private readonly toast = inject(AppToastService);

  show(kind: BannerFormSnackKind): void {
    const c = SNACK_BY_KIND[kind];
    if (kind === "created" || kind === "updated") {
      this.toast.success(c.message, c.duration);
    } else {
      this.toast.error(c.message, c.duration);
    }
  }
}
