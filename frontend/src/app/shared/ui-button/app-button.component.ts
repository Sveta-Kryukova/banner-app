import { NgClass } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  output,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatTooltipModule } from "@angular/material/tooltip";
import type { AppButtonColor, AppButtonMode, AppButtonVariant } from "./app-button.types";
import { matButtonAppearanceFromVariant } from "./mat-button-appearance";

@Component({
  selector: "app-button, app-icon-button",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, MatButtonModule, MatTooltipModule],
  templateUrl: "./app-button.component.html",
  styleUrl: "./app-button.component.scss",
})
export class AppButtonComponent {
  private readonly hostTag = (
    inject(ElementRef) as ElementRef<HTMLElement>
  ).nativeElement.tagName.toLowerCase();

  private readonly hostIsIconTag = this.hostTag === "app-icon-button";

  readonly mode = input<AppButtonMode>("auto");

  protected readonly isIconMode = computed(() => {
    switch (this.mode()) {
      case "icon":
        return true;
      case "standard":
        return false;
      default:
        return this.hostIsIconTag;
    }
  });

  readonly variant = input<AppButtonVariant>("text");
  readonly color = input<AppButtonColor | undefined>(undefined);
  readonly type = input<"button" | "submit" | "reset">("button");
  readonly disabled = input(false);

  readonly tooltip = input<string | null>(null);
  readonly tooltipDisabled = input(true);

  readonly formId = input<string | null>(null);
  readonly buttonClass = input<string | undefined>(undefined);

  readonly ariaLabel = input<string | undefined>(undefined);

  readonly clicked = output<void>();

  protected readonly matAppearance = computed(() =>
    matButtonAppearanceFromVariant(this.variant()),
  );

  protected onIconClick(): void {
    this.clicked.emit();
  }
}
