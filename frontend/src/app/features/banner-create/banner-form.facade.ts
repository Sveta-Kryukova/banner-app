import { computed, inject, Injectable, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Router } from "@angular/router";
import { firstValueFrom, merge } from "rxjs";
import { startWith } from "rxjs/operators";
import { APP_PATH } from "../../app-paths";
import type { Banner } from "../../models/banner.model";
import { BannerApiService } from "../../services/banner-api.service";
import { AppDialogService } from "../../shared/app-dialog/app-dialog.service";
import { getSaveDisabledTooltip } from "../../shared/save-disabled-tooltip/save-disabled-tooltip";
import {
  BANNER_EDIT_SAVE_DISABLED_TOOLTIP,
  BANNER_FORM_COPY,
  BANNER_FORM_ID,
  BANNER_FORM_PAGE_TITLE,
  BANNER_IMAGE_FIELD_LABEL_ID,
  BANNER_SAVE_DISABLED_TOOLTIP,
} from "./banner-create.constants";
import { createBannerCreateForm } from "./banner-create-form.factory";
import type { BannerCreateFormViewProps } from "./banner-create.types";
import {
  hasUnsavedBannerForm,
  type BannerInitialSnapshot,
} from "./banner-form-unsaved";
import { BannerFormSnackBar } from "./banner-form.snackbar";
import { BannerImageFileService } from "./services/banner-image-file.service";

@Injectable()
export class BannerFormFacade {
  private readonly router = inject(Router);
  private readonly appDialog = inject(AppDialogService);
  private readonly snack = inject(BannerFormSnackBar);
  private readonly bannerApi = inject(BannerApiService);
  private readonly imageFile = inject(BannerImageFileService);

  readonly formId = BANNER_FORM_ID;
  readonly imageLabelId = BANNER_IMAGE_FIELD_LABEL_ID;

  readonly form = createBannerCreateForm();

  private readonly formValid = signal(this.form.valid);
  readonly previewUrl = signal<string | null>(null);
  readonly selectedFile = signal<File | null>(null);
  readonly imageError = signal<string | null>(null);
  readonly isSubmitting = signal(false);

  readonly isEditMode = signal(false);
  readonly isLoadingBanner = signal(false);
  readonly loadedBanner = signal<Banner | null>(null);

  private readonly hasExistingImage = signal(false);
  private readonly initialSnapshot = signal<BannerInitialSnapshot | null>(null);

  readonly pageTitle = computed(() =>
    this.isEditMode()
      ? BANNER_FORM_PAGE_TITLE.edit
      : BANNER_FORM_PAGE_TITLE.create,
  );

  readonly canSave = computed(() => {
    const base =
      this.formValid() &&
      this.imageError() === null &&
      !this.isSubmitting();
    if (!this.isEditMode()) {
      return base && this.selectedFile() !== null;
    }
    return (
      base &&
      (this.selectedFile() !== null || this.hasExistingImage())
    );
  });

  readonly saveDisabledTooltip = computed(() => {
    const nameCtrl = this.form.controls.name;
    const nameTrimmed = nameCtrl.value.trim();
    const messages = this.isEditMode()
      ? BANNER_EDIT_SAVE_DISABLED_TOOLTIP
      : BANNER_SAVE_DISABLED_TOOLTIP;
    return getSaveDisabledTooltip(
      {
        isSubmitting: this.isSubmitting(),
        nameTrimmed,
        nameInvalid: nameCtrl.invalid && nameTrimmed.length > 0,
        attachmentError: this.imageError(),
        hasAttachment:
          this.selectedFile() !== null || this.hasExistingImage(),
      },
      messages,
    );
  });

  readonly formView = computed(
    (): BannerCreateFormViewProps => ({
      form: this.form,
      formId: this.formId,
      imageLabelId: this.imageLabelId,
      previewUrl: this.previewUrl(),
      fileName:
        this.selectedFile()?.name ??
        (this.hasExistingImage() ? "Current image" : null),
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

  initCreate(): void {
    this.isEditMode.set(false);
    this.isLoadingBanner.set(false);
    this.loadedBanner.set(null);
    this.initialSnapshot.set(null);
    this.hasExistingImage.set(false);
  }

  async loadForEdit(id: number): Promise<void> {
    this.isEditMode.set(true);
    this.isLoadingBanner.set(true);
    this.loadedBanner.set(null);
    this.initialSnapshot.set(null);
    try {
      const b = await firstValueFrom(this.bannerApi.getById(id));
      this.loadedBanner.set(b);
      this.form.controls.name.setValue(b.name);
      this.initialSnapshot.set({ name: b.name, hadImage: true });
      this.previewUrl.set(this.imageFile.dataUrlFromRawBase64(b.imageBase64));
      this.hasExistingImage.set(true);
      this.selectedFile.set(null);
      this.imageError.set(null);
    } catch {
      this.snack.show("notFound");
      await this.router.navigateByUrl(APP_PATH.banners);
    } finally {
      this.isLoadingBanner.set(false);
    }
  }

  onFileSelected(file: File): void {
    const result = this.imageFile.validateForBanner(file);
    if (!result.ok) {
      this.imageError.set(result.message);
      return;
    }
    this.imageFile.revokePreviewIfBlob(this.previewUrl());
    this.imageError.set(null);
    this.selectedFile.set(file);
    this.previewUrl.set(this.imageFile.createObjectUrl(file));
    this.hasExistingImage.set(true);
  }

  onClearImage(): void {
    this.imageFile.revokePreviewIfBlob(this.previewUrl());
    this.previewUrl.set(null);
    this.selectedFile.set(null);
    this.imageError.set(null);
    this.hasExistingImage.set(false);
  }

  async onCancelRequested(): Promise<void> {
    if (!this.hasUnsavedFormContent()) {
      await this.router.navigateByUrl(APP_PATH.banners);
      return;
    }
    const ref = this.appDialog.openConfirm({
      title: BANNER_FORM_COPY.leaveTitle,
      body: BANNER_FORM_COPY.leaveBody,
    });
    const result = await firstValueFrom(ref.closed);
    if (result === true) {
      await this.router.navigateByUrl(APP_PATH.banners);
    }
  }

  private hasUnsavedFormContent(): boolean {
    return hasUnsavedBannerForm({
      isEditMode: this.isEditMode(),
      nameValue: this.form.controls.name.value,
      selectedFile: this.selectedFile(),
      imageError: this.imageError(),
      hasExistingImage: this.hasExistingImage(),
      initialSnapshot: this.initialSnapshot(),
    });
  }

  async onSubmit(): Promise<void> {
    this.form.markAllAsTouched();
    if (!this.canSave() || this.isSubmitting()) {
      return;
    }
    const name = this.form.controls.name.value.trim();

    if (this.isEditMode()) {
      const banner = this.loadedBanner();
      if (!banner) {
        return;
      }
      const file = this.selectedFile();
      this.isSubmitting.set(true);
      try {
        const imageBase64 = file
          ? await this.imageFile.fileToRawBase64(file)
          : banner.imageBase64;
        await firstValueFrom(
          this.bannerApi.update(banner.id, { name, imageBase64 }),
        );
        this.snack.show("updated");
        await this.router.navigateByUrl(APP_PATH.banners);
      } catch {
        this.snack.show("updateError");
      } finally {
        this.isSubmitting.set(false);
      }
      return;
    }

    const file = this.selectedFile();
    if (!file) {
      return;
    }
    this.isSubmitting.set(true);
    try {
      const imageBase64 = await this.imageFile.fileToRawBase64(file);
      await firstValueFrom(this.bannerApi.create({ name, imageBase64 }));
      this.snack.show("created");
      await this.router.navigateByUrl(APP_PATH.banners);
    } catch {
      this.snack.show("createError");
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
