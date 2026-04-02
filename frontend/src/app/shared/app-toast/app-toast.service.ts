import { inject, Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AppToastComponent } from "./app-toast.component";
import type { AppToastVariant } from "./app-toast.types";

const DEFAULT_SUCCESS_MS = 4000;
const DEFAULT_ERROR_MS = 6000;
const DEFAULT_INFO_MS = 4000;

@Injectable({ providedIn: "root" })
export class AppToastService {
  private readonly snackBar = inject(MatSnackBar);

  success(message: string, durationMs = DEFAULT_SUCCESS_MS): void {
    this.open(message, "success", durationMs);
  }

  error(message: string, durationMs = DEFAULT_ERROR_MS): void {
    this.open(message, "error", durationMs);
  }

  info(message: string, durationMs = DEFAULT_INFO_MS): void {
    this.open(message, "info", durationMs);
  }

  private open(
    message: string,
    variant: AppToastVariant,
    durationMs: number,
  ): void {
    this.snackBar.openFromComponent(AppToastComponent, {
      data: { message, variant },
      duration: durationMs,
      horizontalPosition: "end",
      verticalPosition: "bottom",
      panelClass: ["app-toast-panel", `app-toast-panel--${variant}`],
    });
  }
}
