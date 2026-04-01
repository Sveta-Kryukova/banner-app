import { ChangeDetectionStrategy, Component, input, output } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import type { BannerCreateFormViewProps } from "../../banner-create.types";
import { BannerImageDropComponent } from "../banner-image-drop/banner-image-drop.component";
import { AppButtonComponent } from "../../../../shared/ui-button/app-button.component";

/**
 * Presentational shell: Material card + form + actions. Emits user intent only.
 */
@Component({
  selector: "app-banner-create-form",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    AppButtonComponent,
    BannerImageDropComponent,
  ],
  templateUrl: "./banner-create-form.component.html",
  styleUrl: "./banner-create-form.component.scss",
})
export class BannerCreateFormComponent {
  readonly view = input.required<BannerCreateFormViewProps>();

  readonly submitted = output<void>();
  readonly fileSelected = output<File>();
  readonly clearImage = output<void>();
  readonly cancelRequested = output<void>();
}
