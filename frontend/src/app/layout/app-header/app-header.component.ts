import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { APP_PATH } from "../../app-paths";
import { HEADER_NAV_ITEMS, HEADER_UI } from "./app-header.config";

@Component({
  selector: "app-header",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: "./app-header.component.html",
  styleUrl: "./app-header.component.scss",
})
export class AppHeaderComponent {
  readonly appTitle = input(HEADER_UI.appTitle);
  readonly mainNavAriaLabel = input(HEADER_UI.mainNavAriaLabel);
  protected readonly homePath = APP_PATH.banners;
  protected readonly navItems = HEADER_NAV_ITEMS;
}
