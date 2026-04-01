import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import type { AppPath } from "../../../../app-paths";
import { NavLinkComponent } from "../../../../shared/nav-link/nav-link.component";

@Component({
  selector: "app-banner-list-empty",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCardModule, NavLinkComponent],
  templateUrl: "./banner-list-empty.component.html",
  styleUrl: "./banner-list-empty.component.scss",
})
export class BannerListEmptyComponent {
  readonly createPath = input.required<AppPath>();
}
