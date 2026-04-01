import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { BannerCreateFacade } from "./banner-create.facade";
import { BannerCreateFormComponent } from "./components/banner-create-form/banner-create-form.component";

@Component({
  selector: "app-banner-create-page",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BannerCreateFormComponent],
  providers: [BannerCreateFacade],
  templateUrl: "./banner-create-page.component.html",
  styleUrl: "./banner-create-page.component.scss",
})
export class BannerCreatePageComponent {
  protected readonly facade = inject(BannerCreateFacade);
}
