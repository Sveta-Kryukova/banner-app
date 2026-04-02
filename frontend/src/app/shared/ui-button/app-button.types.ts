import type { ThemePalette } from "@angular/material/core";

export type AppButtonVariant = "text" | "flat" | "stroked";

export type AppButtonColor = ThemePalette;

/** `auto` — icon for `<app-icon-button>`, standard for `<app-button>`. */
export type AppButtonMode = "auto" | "icon" | "standard";
