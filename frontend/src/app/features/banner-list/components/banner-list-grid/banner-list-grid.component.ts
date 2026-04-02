import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import type { Banner } from "../../../../models/banner.model";
import type { BannerCardVm } from "../../banner-list.types";
import { BannerCardComponent } from "../banner-card/banner-card.component";

@Component({
  selector: "app-banner-list-grid",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BannerCardComponent],
  templateUrl: "./banner-list-grid.component.html",
  styleUrl: "./banner-list-grid.component.scss",
})
export class BannerListGridComponent {
  readonly cards = input.required<readonly BannerCardVm[]>();

  readonly deleteBanner = output<Banner>();
}
