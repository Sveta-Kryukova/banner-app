import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { matButtonAppearanceFromVariant } from "../ui-button/mat-button-appearance";
import {
  NAV_LINK_ACTIVE_CLASS,
  appButtonVariantForNavLink,
  type NavLinkRouterActiveOptions,
  type NavLinkVariant,
} from "./nav-link.types";

@Component({
  selector: "app-nav-link",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, MatButtonModule, MatIconModule],
  templateUrl: "./nav-link.component.html",
  styleUrl: "./nav-link.component.scss",
})
export class NavLinkComponent {
  readonly variant = input.required<NavLinkVariant>();
  readonly path = input.required<string>();
  readonly label = input.required<string>();
  readonly icon = input<string | undefined>(undefined);

  readonly routerLinkActiveOptions = input<NavLinkRouterActiveOptions>({
    exact: false,
  });

  protected readonly activeRouteClass = NAV_LINK_ACTIVE_CLASS;

  protected readonly isHeaderVariant = computed(
    () => this.variant() === "header",
  );

  protected readonly isTitleVariant = computed(
    () => this.variant() === "title",
  );

  protected readonly isCardVariant = computed(
    () => this.variant() === "card",
  );

  protected readonly matAppearance = computed(() =>
    matButtonAppearanceFromVariant(appButtonVariantForNavLink(this.variant())),
  );
}
