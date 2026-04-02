export interface SaveDisabledTooltipState {
  readonly isSubmitting: boolean;
  readonly nameTrimmed: string;
  readonly nameInvalid: boolean;
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
