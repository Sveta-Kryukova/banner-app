import type { AppButtonVariant } from "./app-button.types";

export type MatButtonAppearance = "text" | "filled" | "outlined";

export function matButtonAppearanceFromVariant(
  variant: AppButtonVariant,
): MatButtonAppearance {
  switch (variant) {
    case "flat":
      return "filled";
    case "stroked":
      return "outlined";
    default:
      return "text";
  }
}
