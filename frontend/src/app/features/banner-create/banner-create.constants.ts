import type { SaveDisabledTooltipMessages } from "../../shared/save-disabled-tooltip/save-disabled-tooltip";

/** Stable DOM ids for a11y (label ↔ control association). */
export const BANNER_CREATE_FORM_ID = "bannerCreateForm" as const;
export const BANNER_IMAGE_FIELD_LABEL_ID = "banner-image-label" as const;

/** Copy for dialogs / snack bars (single source of truth). */
export const BANNER_CREATE_COPY = {
  leaveTitle: "Leave without saving?",
  leaveBody:
    "Your unsaved changes will be lost if you leave this page.",
  snackSaved: "Banner saved",
  snackSavedAction: "Close",
  snackError: "Could not save the banner. Try again.",
  snackErrorAction: "Dismiss",
} as const;

/** Copy for `getSaveDisabledTooltip` on the banner create form. */
export const BANNER_SAVE_DISABLED_TOOLTIP = {
  submitting: "Saving…",
  nameEmpty: "Enter a name for the banner.",
  nameInvalid: "Fix the name (required, up to 200 characters).",
  noAttachment:
    "Add an image: drag a file into the zone or use Choose image (JPG or PNG, up to 5 MB).",
} as const satisfies SaveDisabledTooltipMessages;
