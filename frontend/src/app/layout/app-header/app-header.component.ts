import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { MatToolbarModule } from "@angular/material/toolbar";
import { NavLinkComponent } from "../../shared/nav-link/nav-link.component";
import { APP_PATH } from "../../app-paths";
import { HEADER_NAV_ITEMS, HEADER_UI } from "./app-header.config";

@Component({
  selector: "app-header",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatToolbarModule, NavLinkComponent],
  templateUrl: "./app-header.component.html",
  styleUrl: "./app-header.component.scss",
})
export class AppHeaderComponent {
  readonly appTitle = input(HEADER_UI.appTitle);
  readonly mainNavAriaLabel = input(HEADER_UI.mainNavAriaLabel);
  protected readonly homePath = APP_PATH.banners;
  protected readonly navItems = HEADER_NAV_ITEMS;
}
