import { DestroyRef, inject, Injectable } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ActivatedRoute, Router } from "@angular/router";
import { distinctUntilChanged, map } from "rxjs/operators";
import { APP_PATH } from "../../../app-paths";
import { BannerFormFacade } from "../banner-form.facade";

@Injectable()
export class BannerFormRouteService {
  private readonly facade = inject(BannerFormFacade);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.route.paramMap
      .pipe(
        map((params) => params.get("bannerId")),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((bannerIdParam) => {
        if (bannerIdParam) {
          const id = Number(bannerIdParam);
          if (Number.isFinite(id) && id >= 1) {
            this.facade.loadForEdit(id);
          } else {
            void this.router.navigateByUrl(APP_PATH.banners);
          }
        } else {
          this.facade.initCreate();
        }
      });
  }
}
