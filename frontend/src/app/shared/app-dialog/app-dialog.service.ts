import { Dialog, DialogRef } from "@angular/cdk/dialog";
import { inject, Injectable } from "@angular/core";
import { AppDialogComponent } from "./app-dialog.component";
import type { AppDialogData } from "./app-dialog.types";

const PANEL = {
  panelClass: "app-dialog-panel",
  maxWidth: "28rem",
} as const;

@Injectable({ providedIn: "root" })
export class AppDialogService {
  private readonly dialog = inject(Dialog);

  openConfirm(data: {
    title: string;
    body: string;
    okLabel?: string;
    cancelLabel?: string;
  }): DialogRef<boolean | undefined, AppDialogComponent> {
    return this.dialog.open(AppDialogComponent, {
      ...PANEL,
      data: { kind: "confirm", ...data } satisfies AppDialogData,
    });
  }

  openInfo(data: {
    title: string;
    body: string;
    closeLabel?: string;
  }): DialogRef<undefined, AppDialogComponent> {
    return this.dialog.open(AppDialogComponent, {
      ...PANEL,
      data: { kind: "info", ...data } satisfies AppDialogData,
    });
  }
}
