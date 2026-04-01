/**
 * Reusable helper: tooltip text explaining why a primary Save/submit action is disabled.
 * Typical flow: submitting → name → optional attachment validation error → attachment required.
 */
export interface SaveDisabledTooltipState {
  readonly isSubmitting: boolean;
  readonly nameTrimmed: string;
  readonly nameInvalid: boolean;
  /** e.g. file validation message; shown before the "no attachment" hint. */
  readonly attachmentError: string | null;
  readonly hasAttachment: boolean;
}

export interface SaveDisabledTooltipMessages {
  submitting: string;
  nameEmpty: string;
  nameInvalid: string;
  noAttachment: string;
}

export function getSaveDisabledTooltip(
  s: SaveDisabledTooltipState,
  messages: SaveDisabledTooltipMessages,
): string {
  if (s.isSubmitting) {
    return messages.submitting;
  }
  if (!s.nameTrimmed) {
    return messages.nameEmpty;
  }
  if (s.nameInvalid) {
    return messages.nameInvalid;
  }
  if (s.attachmentError) {
    return s.attachmentError;
  }
  if (!s.hasAttachment) {
    return messages.noAttachment;
  }
  return "";
}
