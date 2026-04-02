import type { SaveDisabledTooltipMessages } from "../../shared/save-disabled-tooltip/save-disabled-tooltip";

export const BANNER_FORM_ID = "bannerForm" as const;
export const BANNER_IMAGE_FIELD_LABEL_ID = "banner-image-label" as const;

export const BANNER_FORM_PAGE_TITLE = {
  create: "New banner",
  edit: "Edit banner",
} as const;

export const BANNER_FORM_COPY = {
  leaveTitle: "Leave without saving?",
  leaveBody:
    "Your unsaved changes will be lost if you leave this page.",
  snackCreated: "Banner saved",
  snackUpdated: "Banner updated",
  snackCreateError: "Could not save the banner. Try again.",
  snackUpdateError: "Could not update the banner. Try again.",
  notFoundSnack: "Banner not found",
  snackDismiss: "Close",
  snackDismissError: "Dismiss",
} as const;

export const BANNER_SAVE_DISABLED_TOOLTIP = {
  submitting: "Saving…",
  nameEmpty: "Enter a name for the banner and download the image.",
  nameInvalid: "Fix the name (required, up to 200 characters).",
  noAttachment:
    "Add an image: drag a file into the zone or use Choose image (JPG or PNG, up to 5 MB).",
} as const satisfies SaveDisabledTooltipMessages;

export const BANNER_EDIT_SAVE_DISABLED_TOOLTIP = {
  ...BANNER_SAVE_DISABLED_TOOLTIP,
  noAttachment:
    "Add an image or keep the existing one (JPG or PNG, up to 5 MB).",
} as const satisfies SaveDisabledTooltipMessages;
