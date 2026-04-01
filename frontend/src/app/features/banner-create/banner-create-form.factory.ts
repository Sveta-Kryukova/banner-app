import { FormControl, FormGroup, Validators } from "@angular/forms";
import type { BannerCreateFormGroup } from "./banner-create.types";

/** Builds the reactive form model (pure — easy to unit test). */
export function createBannerCreateForm(): BannerCreateFormGroup {
  return new FormGroup({
    name: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(200)],
    }),
  });
}
