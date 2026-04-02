export interface BannerInitialSnapshot {
  readonly name: string;
  readonly hadImage: boolean;
}

export interface BannerUnsavedState {
  readonly isEditMode: boolean;
  readonly nameValue: string;
  readonly selectedFile: File | null;
  readonly imageError: string | null;
  readonly hasExistingImage: boolean;
  readonly initialSnapshot: BannerInitialSnapshot | null;
}

export function hasUnsavedBannerForm(state: BannerUnsavedState): boolean {
  if (state.isEditMode) {
    const snap = state.initialSnapshot;
    if (!snap) {
      return false;
    }
    const nameNow = state.nameValue.trim();
    if (nameNow !== snap.name.trim()) {
      return true;
    }
    if (state.selectedFile !== null) {
      return true;
    }
    if (state.imageError !== null) {
      return true;
    }
    if (snap.hadImage && !state.hasExistingImage) {
      return true;
    }
    return false;
  }
  const name = state.nameValue.trim();
  if (name.length > 0) {
    return true;
  }
  if (state.selectedFile !== null) {
    return true;
  }
  if (state.imageError !== null) {
    return true;
  }
  return false;
}
