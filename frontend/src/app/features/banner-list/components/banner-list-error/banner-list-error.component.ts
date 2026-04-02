import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { AppButtonComponent } from "../../../../shared/ui-button/app-button.component";

@Component({
  selector: "app-banner-list-error",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCardModule, AppButtonComponent],
  templateUrl: "./banner-list-error.component.html",
  styleUrl: "./banner-list-error.component.scss",
})
export class BannerListErrorComponent {
  readonly message = input.required<string>();
  readonly retryLabel = input.required<string>();

  readonly retry = output<void>();
}
