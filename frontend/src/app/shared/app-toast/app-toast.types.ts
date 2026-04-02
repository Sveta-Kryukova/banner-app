export type AppToastVariant = "success" | "error" | "info";

export interface AppToastData {
  readonly message: string;
  readonly variant: AppToastVariant;
}
