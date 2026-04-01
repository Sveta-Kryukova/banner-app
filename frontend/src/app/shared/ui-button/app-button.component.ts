import { NgClass } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatTooltipModule } from "@angular/material/tooltip";
import type { AppButtonColor, AppButtonVariant } from "./app-button.types";
import { matButtonAppearanceFromVariant } from "./mat-button-appearance";

/**
 * Presentational wrapper around `matButton` + optional tooltip.
 * Use for actions (forms, dialogs). For in-app navigation prefer {@link NavLinkComponent} (`<a matButton>` + `routerLink`).
 */
@Component({
  selector: "app-button",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, MatButtonModule, MatTooltipModule],
  templateUrl: "./app-button.component.html",
  styleUrl: "./app-button.component.scss",
})
export class AppButtonComponent {
  readonly variant = input<AppButtonVariant>("text");
  readonly color = input<AppButtonColor | undefined>(undefined);
  readonly type = input<"button" | "submit" | "reset">("button");
  readonly disabled = input(false);

  readonly tooltip = input<string | null>(null);
  /** When `true`, the tooltip is hidden (e.g. Save enabled). */
  readonly tooltipDisabled = input(true);

  readonly formId = input<string | null>(null);
  /** Extra class on the native `button[matButton]` (e.g. layout hooks). */
  readonly buttonClass = input<string | undefined>(undefined);

  protected readonly matAppearance = computed(() =>
    matButtonAppearanceFromVariant(this.variant()),
  );
}
