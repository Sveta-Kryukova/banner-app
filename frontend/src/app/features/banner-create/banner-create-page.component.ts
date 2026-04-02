import { ChangeDetectionStrategy, Component, DestroyRef, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ActivatedRoute, Router } from "@angular/router";
import { distinctUntilChanged, map } from "rxjs/operators";
import { APP_PATH } from "../../app-paths";
import { LoadingSpinnerComponent } from "../../shared/loading-spinner/loading-spinner.component";
import { BannerCreateFormComponent } from "./components/banner-create-form/banner-create-form.component";
import { BannerFormFacade } from "./banner-form.facade";
import { BannerFormSnackBar } from "./banner-form.snackbar";

@Component({
  selector: "app-banner-create-page",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BannerCreateFormComponent, LoadingSpinnerComponent],
  providers: [BannerFormFacade, BannerFormSnackBar],
  templateUrl: "./banner-create-page.component.html",
  styleUrl: "./banner-create-page.component.scss",
})
export class BannerCreatePageComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  protected readonly facade = inject(BannerFormFacade);

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
            void this.facade.loadForEdit(id);
          } else {
            void this.router.navigateByUrl(APP_PATH.banners);
          }
        } else {
          this.facade.initCreate();
        }
      });
  }
}
