import { FormControl, FormGroup, Validators } from "@angular/forms";
import type { BannerCreateFormGroup } from "./banner-create.types";

export function createBannerCreateForm(): BannerCreateFormGroup {
  return new FormGroup({
    name: new FormControl("", {
      nonNullable: true,
      validators: [(c) => Validators.required(c), Validators.maxLength(200)],
    }),
  });
}
