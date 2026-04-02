import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@Component({
  selector: "app-loading-spinner",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatProgressSpinnerModule],
  templateUrl: "./loading-spinner.component.html",
  styleUrl: "./loading-spinner.component.scss",
})
export class LoadingSpinnerComponent {
  /** Material spinner size in pixels. */
  readonly diameter = input<number>(40);

  /** Tight padding for inline placeholders (e.g. image preview). */
  readonly compact = input(false);
}
