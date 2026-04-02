import { DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  output,
  signal,
  untracked,
} from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import type { Banner } from "../../../../models/banner.model";
import { NavLinkComponent } from "../../../../shared/nav-link/nav-link.component";
import { AppButtonComponent } from "../../../../shared/ui-button/app-button.component";
import type { BannerCardVm } from "../../banner-list.types";

@Component({
  selector: "app-banner-card",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, MatIconModule, NavLinkComponent, AppButtonComponent],
  templateUrl: "./banner-card.component.html",
  styleUrl: "./banner-card.component.scss",
})
export class BannerCardComponent {
  readonly card = input.required<BannerCardVm>();

  readonly deleteBanner = output<Banner>();

  protected readonly imageLoadFailed = signal(false);

  constructor() {
    effect(() => {
      this.card();
      untracked(() => this.imageLoadFailed.set(false));
    });
  }

  protected onImageError(): void {
    this.imageLoadFailed.set(true);
  }
}
