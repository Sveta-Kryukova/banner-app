import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { LoadingSpinnerComponent } from "../../shared/loading-spinner/loading-spinner.component";
import { BannerCreateFormComponent } from "./components/banner-create-form/banner-create-form.component";
import { BannerFormFacade } from "./banner-form.facade";
import { BannerFormSnackBar } from "./banner-form.snackbar";
import { BannerFormRouteService } from "./services/banner-form-route.service";

@Component({
  selector: "app-banner-create-page",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BannerCreateFormComponent, LoadingSpinnerComponent],
  providers: [BannerFormFacade, BannerFormSnackBar, BannerFormRouteService],
  templateUrl: "./banner-create-page.component.html",
  styleUrl: "./banner-create-page.component.scss",
})
export class BannerCreatePageComponent {
  protected readonly facade = inject(BannerFormFacade);

  constructor() {
    inject(BannerFormRouteService);
  }
}
