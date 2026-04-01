import { FormControl, FormGroup } from "@angular/forms";

/** Reactive form model for the create-banner screen. */
export type BannerCreateFormGroup = FormGroup<{
  name: FormControl<string>;
}>;

/**
 * Snapshot passed from {@link BannerCreateFacade} to the dumb form (one binding, typed UI contract).
 */
export interface BannerCreateFormViewProps {
  readonly form: BannerCreateFormGroup;
  readonly formId: string;
  readonly imageLabelId: string;
  readonly previewUrl: string | null;
  readonly fileName: string | null;
  readonly imageError: string | null;
  readonly isSubmitting: boolean;
  readonly canSave: boolean;
  readonly saveDisabledTooltip: string;
}
