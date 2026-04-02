export type AppDialogKind = "confirm" | "info";

export interface AppDialogData {
  readonly kind: AppDialogKind;
  readonly title: string;
  readonly body: string;
  readonly okLabel?: string;
  readonly cancelLabel?: string;
  readonly closeLabel?: string;
}
