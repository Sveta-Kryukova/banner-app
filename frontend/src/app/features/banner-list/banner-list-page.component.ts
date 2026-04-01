import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { APP_PATH } from "../../app-paths";
import type { Banner } from "../../models/banner.model";
import { BannerListEmptyComponent } from "./components/banner-list-empty/banner-list-empty.component";

@Component({
  selector: "app-banner-list-page",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BannerListEmptyComponent],
  templateUrl: "./banner-list-page.component.html",
  styleUrl: "./banner-list-page.component.scss",
})
export class BannerListPageComponent {
  protected readonly createBannerPath = APP_PATH.bannersNew;
  protected readonly banners = signal<Banner[]>([]);
}
