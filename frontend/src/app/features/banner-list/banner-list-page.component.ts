import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { InfiniteScrollDirective } from "ngx-infinite-scroll";
import { LoadingSpinnerComponent } from "../../shared/loading-spinner/loading-spinner.component";
import { BANNER_LIST_COPY } from "./banner-list.constants";
import { BannerListFacade } from "./banner-list.facade";
import { BannerListEmptyComponent } from "./components/banner-list-empty/banner-list-empty.component";
import { BannerListErrorComponent } from "./components/banner-list-error/banner-list-error.component";
import { BannerListGridComponent } from "./components/banner-list-grid/banner-list-grid.component";

@Component({
  selector: "app-banner-list-page",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [BannerListFacade],
  imports: [
    BannerListEmptyComponent,
    BannerListErrorComponent,
    BannerListGridComponent,
    InfiniteScrollDirective,
    LoadingSpinnerComponent,
    MatProgressSpinnerModule,
  ],
  templateUrl: "./banner-list-page.component.html",
  styleUrl: "./banner-list-page.component.scss",
})
export class BannerListPageComponent {
  protected readonly facade = inject(BannerListFacade);
  protected readonly listCopy = BANNER_LIST_COPY;
}
