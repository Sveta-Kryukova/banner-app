import { computed, inject, Injectable, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { firstValueFrom, merge } from "rxjs";
import { startWith } from "rxjs/operators";
import { APP_PATH } from "../../app-paths";
import { BannerApiService } from "../../services/banner-api.service";
import { AppDialogService } from "../../shared/app-dialog/app-dialog.service";
import {
  BANNER_CREATE_COPY,
  BANNER_CREATE_FORM_ID,
  BANNER_IMAGE_FIELD_LABEL_ID,
  BANNER_SAVE_DISABLED_TOOLTIP,
} from "./banner-create.constants";
import { createBannerCreateForm } from "./banner-create-form.factory";
import type {
  BannerCreateFormViewProps,
} from "./banner-create.types";
import { getSaveDisabledTooltip } from "../../shared/save-disabled-tooltip/save-disabled-tooltip";
import { BannerImageFileService } from "./services/banner-image-file.service";

@Injectable()
export class BannerCreateFacade {
  private readonly router = inject(Router);
  private readonly appDialog = inject(AppDialogService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly bannerApi = inject(BannerApiService);
  private readonly imageFile = inject(BannerImageFileService);

  readonly formId = BANNER_CREATE_FORM_ID;
  readonly imageLabelId = BANNER_IMAGE_FIELD_LABEL_ID;

  readonly form = createBannerCreateForm();

  private readonly formValid = signal(this.form.valid);
  readonly previewUrl = signal<string | null>(null);
  readonly selectedFile = signal<File | null>(null);
  readonly imageError = signal<string | null>(null);
  readonly isSubmitting = signal(false);

  readonly canSave = computed(
    () =>
      this.formValid() &&
      this.selectedFile() !== null &&
      this.imageError() === null,
  );

  readonly saveDisabledTooltip = computed(() => {
    const nameCtrl = this.form.controls.name;
    const nameTrimmed = nameCtrl.value.trim();
    return getSaveDisabledTooltip(
      {
        isSubmitting: this.isSubmitting(),
        nameTrimmed,
        nameInvalid: nameCtrl.invalid && nameTrimmed.length > 0,
        attachmentError: this.imageError(),
        hasAttachment: this.selectedFile() !== null,
      },
      BANNER_SAVE_DISABLED_TOOLTIP,
    );
  });

  readonly formView = computed(
    (): BannerCreateFormViewProps => ({
      form: this.form,
      formId: this.formId,
      imageLabelId: this.imageLabelId,
      previewUrl: this.previewUrl(),
      fileName: this.selectedFile()?.name ?? null,
      imageError: this.imageError(),
      isSubmitting: this.isSubmitting(),
      canSave: this.canSave(),
      saveDisabledTooltip: this.saveDisabledTooltip(),
    }),
  );

  constructor() {
    merge(this.form.statusChanges, this.form.valueChanges)
      .pipe(startWith(null), takeUntilDestroyed())
      .subscribe(() => this.formValid.set(this.form.valid));
  }

  onFileSelected(file: File): void {
    const result = this.imageFile.validateForBanner(file);
    if (!result.ok) {
      this.imageError.set(result.message);
      return;
    }
    this.imageFile.revokeObjectUrl(this.previewUrl());
    this.imageError.set(null);
    this.selectedFile.set(file);
    this.previewUrl.set(this.imageFile.createObjectUrl(file));
  }

  onClearImage(): void {
    this.imageFile.revokeObjectUrl(this.previewUrl());
    this.previewUrl.set(null);
    this.selectedFile.set(null);
    this.imageError.set(null);
  }

  async onCancelRequested(): Promise<void> {
    if (!this.hasUnsavedFormContent()) {
      await this.router.navigateByUrl(APP_PATH.banners);
      return;
    }
    const ref = this.appDialog.openConfirm({
      title: BANNER_CREATE_COPY.leaveTitle,
      body: BANNER_CREATE_COPY.leaveBody,
    });
    const result = await firstValueFrom(ref.closed);
    if (result === true) {
      await this.router.navigateByUrl(APP_PATH.banners);
    }
  }

  private hasUnsavedFormContent(): boolean {
    const name = this.form.controls.name.value.trim();
    if (name.length > 0) {
      return true;
    }
    if (this.selectedFile() !== null) {
      return true;
    }
    if (this.imageError() !== null) {
      return true;
    }
    return false;
  }

  async onSubmit(): Promise<void> {
    this.form.markAllAsTouched();
    if (!this.canSave() || this.isSubmitting()) {
      return;
    }
    const name = this.form.controls.name.value.trim();
    const file = this.selectedFile();
    if (!file) {
      return;
    }
    this.isSubmitting.set(true);
    try {
      const imageBase64 = await this.imageFile.fileToRawBase64(file);
      await firstValueFrom(this.bannerApi.create({ name, imageBase64 }));
      this.snackBar.open(BANNER_CREATE_COPY.snackSaved, BANNER_CREATE_COPY.snackSavedAction, {
        duration: 4000,
      });
      await this.router.navigateByUrl(APP_PATH.banners);
    } catch {
      this.snackBar.open(BANNER_CREATE_COPY.snackError, BANNER_CREATE_COPY.snackErrorAction, {
        duration: 6000,
      });
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
