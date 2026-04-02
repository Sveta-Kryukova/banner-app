import { FormControl, FormGroup } from "@angular/forms";

export type BannerCreateFormGroup = FormGroup<{
  name: FormControl<string>;
}>;

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
