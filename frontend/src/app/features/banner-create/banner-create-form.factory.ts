import { FormControl, FormGroup, Validators } from "@angular/forms";
import type { BannerCreateFormGroup } from "./banner-create.types";

export function createBannerCreateForm(): BannerCreateFormGroup {
  return new FormGroup({
    name: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(200)],
    }),
  });
}
