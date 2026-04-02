import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { DIALOG_DATA, DialogRef } from "@angular/cdk/dialog";
import { AppButtonComponent } from "../ui-button/app-button.component";
import type { AppDialogData } from "./app-dialog.types";

@Component({
  selector: "app-dialog",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppButtonComponent],
  templateUrl: "./app-dialog.component.html",
  styleUrl: "./app-dialog.component.scss",
})
export class AppDialogComponent {
  protected readonly data = inject<AppDialogData>(DIALOG_DATA);
  private readonly dialogRef = inject(DialogRef<boolean | undefined>);

  protected confirm(): void {
    this.dialogRef.close(true);
  }

  protected dismiss(): void {
    this.dialogRef.close(false);
  }

  protected closeInfo(): void {
    this.dialogRef.close(undefined);
  }
}
