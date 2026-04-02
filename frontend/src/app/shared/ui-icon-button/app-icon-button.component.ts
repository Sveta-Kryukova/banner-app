import { NgClass } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: "app-icon-button",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, MatButtonModule],
  templateUrl: "./app-icon-button.component.html",
  styleUrl: "./app-icon-button.component.scss",
})
export class AppIconButtonComponent {
  readonly type = input<"button" | "submit" | "reset">("button");
  readonly disabled = input(false);
  readonly ariaLabel = input.required<string>();
  readonly buttonClass = input<string | undefined>(undefined);

  readonly clicked = output<void>();
}
