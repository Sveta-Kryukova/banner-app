import type { SaveDisabledTooltipMessages } from "../../shared/save-disabled-tooltip/save-disabled-tooltip";

export const BANNER_CREATE_FORM_ID = "bannerCreateForm" as const;
export const BANNER_IMAGE_FIELD_LABEL_ID = "banner-image-label" as const;

export const BANNER_CREATE_COPY = {
  leaveTitle: "Leave without saving?",
  leaveBody:
    "Your unsaved changes will be lost if you leave this page.",
  snackSaved: "Banner saved",
  snackSavedAction: "Close",
  snackError: "Could not save the banner. Try again.",
  snackErrorAction: "Dismiss",
} as const;

export const BANNER_SAVE_DISABLED_TOOLTIP = {
  submitting: "Saving…",
  nameEmpty: "Enter a name for the banner.",
  nameInvalid: "Fix the name (required, up to 200 characters).",
  noAttachment:
    "Add an image: drag a file into the zone or use Choose image (JPG or PNG, up to 5 MB).",
} as const satisfies SaveDisabledTooltipMessages;
