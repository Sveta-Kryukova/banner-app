import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { RouterLink, RouterLinkActive } from "@angular/router";
import type { NavLinkVariant } from "./nav-link.types";

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
  readonly linkExact = input(false);
}
