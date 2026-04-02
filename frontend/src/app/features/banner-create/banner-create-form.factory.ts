import {
  FormControl,
  FormGroup,
  Validators,
  type ValidatorFn,
} from "@angular/forms";
import type { BannerCreateFormGroup } from "./banner-create.types";

const requiredName: ValidatorFn = (control) =>
  Validators.required(control);

export function createBannerCreateForm(): BannerCreateFormGroup {
  return new FormGroup({
    name: new FormControl("", {
      nonNullable: true,
      validators: [requiredName, Validators.maxLength(200)],
    }),
  });
}
