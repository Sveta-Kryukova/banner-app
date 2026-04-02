import { computed, DestroyRef, inject, Injectable, signal } from "@angular/core";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";
import { Router } from "@angular/router";
import { EMPTY, from, merge, of } from "rxjs";
import {
  catchError,
  filter,
  finalize,
  map,
  startWith,
  switchMap,
  tap,
} from "rxjs/operators";
import { APP_PATH } from "../../app-paths";
import type { Banner } from "../../models/banner.model";
import { BannerApiService } from "../../services/banner-api.service";
import { BannerImageFileService } from "../../services/banner-image-file.service";
import { AppDialogService } from "../../shared/app-dialog/app-dialog.service";
import { getSaveDisabledTooltip } from "../../shared/save-disabled-tooltip/save-disabled-tooltip";
import { createBannerCreateForm } from "./banner-create-form.factory";
import {
  BANNER_EDIT_SAVE_DISABLED_TOOLTIP,
  BANNER_FORM_COPY,
  BANNER_FORM_ID,
  BANNER_FORM_PAGE_TITLE,
  BANNER_IMAGE_FIELD_LABEL_ID,
  BANNER_SAVE_DISABLED_TOOLTIP,
} from "./banner-create.constants";
import type { BannerCreateFormViewProps } from "./banner-create.types";
import {
  hasUnsavedBannerForm,
  type BannerInitialSnapshot,
} from "./banner-form-unsaved";
import { BannerFormSnackBar } from "./banner-form.snackbar";
import { BANNER_EXISTING_IMAGE_FILE_LABEL } from "./banner-image-labels";

@Injectable()
export class BannerFormFacade {
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly appDialog = inject(AppDialogService);
  private readonly formSnackBar = inject(BannerFormSnackBar);
  private readonly bannerApi = inject(BannerApiService);
  private readonly imageFile = inject(BannerImageFileService);

  readonly formId = BANNER_FORM_ID;
  readonly imageLabelId = BANNER_IMAGE_FIELD_LABEL_ID;

  readonly form = createBannerCreateForm();

  private readonly nameControl = this.form.controls.name;

  private readonly formValid = toSignal(
    merge(this.form.statusChanges, this.form.valueChanges).pipe(
      map(() => this.form.valid),
      startWith(this.form.valid),
    ),
    { initialValue: this.form.valid },
  );

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

  private readonly hasAttachment = computed(
    () => this.selectedFile() !== null || this.hasExistingImage(),
  );

  readonly canSave = computed(() => {
    const formOk =
      this.formValid() && this.imageError() === null && !this.isSubmitting();
    return formOk && this.hasAttachment();
  });

  readonly saveDisabledTooltip = computed(() => {
    const nameTrimmed = this.nameControl.value.trim();
    const messages = this.isEditMode()
      ? BANNER_EDIT_SAVE_DISABLED_TOOLTIP
      : BANNER_SAVE_DISABLED_TOOLTIP;
    return getSaveDisabledTooltip(
      {
        isSubmitting: this.isSubmitting(),
        nameTrimmed,
        nameInvalid: this.nameControl.invalid && nameTrimmed.length > 0,
        attachmentError: this.imageError(),
        hasAttachment: this.hasAttachment(),
      },
      messages,
    );
  });

  readonly formView = computed((): BannerCreateFormViewProps => {
    const fileName = this.resolveBannerFileLabel();

    return {
      form: this.form,
      formId: this.formId,
      imageLabelId: this.imageLabelId,
      previewUrl: this.previewUrl(),
      fileName,
      imageError: this.imageError(),
      isSubmitting: this.isSubmitting(),
      canSave: this.canSave(),
      saveDisabledTooltip: this.saveDisabledTooltip(),
    };
  });

  private resolveBannerFileLabel(): string | null {
    const file = this.selectedFile();
    if (file !== null) {
      return file.name;
    }
    if (this.hasExistingImage()) {
      return BANNER_EXISTING_IMAGE_FILE_LABEL;
    }
    return null;
  }

  initCreate(): void {
    this.isEditMode.set(false);
    this.isLoadingBanner.set(false);
    this.loadedBanner.set(null);
    this.initialSnapshot.set(null);
    this.hasExistingImage.set(false);
  }

  loadForEdit(id: number): void {
    this.isEditMode.set(true);
    this.isLoadingBanner.set(true);
    this.loadedBanner.set(null);
    this.initialSnapshot.set(null);
    this.bannerApi
      .getById(id)
      .pipe(
        tap({
          next: (banner) => this.applyBannerFromServer(banner),
        }),
        catchError(() => {
          this.formSnackBar.show("notFound");
          return this.navigateToList$();
        }),
        finalize(() => this.isLoadingBanner.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
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

  onCancelRequested(): void {
    if (!this.hasUnsavedFormContent()) {
      this.navigateToList$()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe();
      return;
    }
    const ref = this.appDialog.openConfirm({
      title: BANNER_FORM_COPY.leaveTitle,
      body: BANNER_FORM_COPY.leaveBody,
    });
    ref.closed
      .pipe(
        filter((r): r is true => r === true),
        switchMap(() => this.navigateToList$()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  private hasUnsavedFormContent(): boolean {
    return hasUnsavedBannerForm({
      isEditMode: this.isEditMode(),
      nameValue: this.nameControl.value,
      selectedFile: this.selectedFile(),
      imageError: this.imageError(),
      hasExistingImage: this.hasExistingImage(),
      initialSnapshot: this.initialSnapshot(),
    });
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (!this.canSave() || this.isSubmitting()) {
      return;
    }

    const name = this.trimmedBannerName();

    if (this.isEditMode()) {
      this.submitUpdate$(name).subscribe();
      return;
    }

    this.submitCreate$(name).subscribe();
  }

  private trimmedBannerName(): string {
    return this.nameControl.value.trim();
  }

  private applyBannerFromServer(banner: Banner): void {
    this.loadedBanner.set(banner);
    this.nameControl.setValue(banner.name);
    this.initialSnapshot.set({ name: banner.name, hadImage: true });
    this.previewUrl.set(
      this.imageFile.dataUrlFromRawBase64(banner.imageBase64),
    );
    this.hasExistingImage.set(true);
    this.selectedFile.set(null);
    this.imageError.set(null);
  }

  private submitUpdate$(name: string) {
    const banner = this.loadedBanner();
    if (!banner) {
      return EMPTY;
    }
    this.isSubmitting.set(true);
    return this.imageBase64ForUpdate$(banner).pipe(
      switchMap((imageBase64) =>
        this.bannerApi.update(banner.id, { name, imageBase64 }),
      ),
      tap(() => this.formSnackBar.show("updated")),
      switchMap(() => this.navigateToList$()),
      catchError(() => {
        this.formSnackBar.show("updateError");
        return EMPTY;
      }),
      finalize(() => this.isSubmitting.set(false)),
      takeUntilDestroyed(this.destroyRef),
    );
  }

  private imageBase64ForUpdate$(banner: Banner) {
    const newFile = this.selectedFile();
    if (newFile) {
      return this.imageFile.fileToRawBase64$(newFile);
    }
    return of(banner.imageBase64);
  }

  private submitCreate$(name: string) {
    const file = this.selectedFile();
    if (!file) {
      return EMPTY;
    }
    this.isSubmitting.set(true);
    return this.imageFile.fileToRawBase64$(file).pipe(
      switchMap((imageBase64) => this.bannerApi.create({ name, imageBase64 })),
      tap(() => this.formSnackBar.show("created")),
      switchMap(() => this.navigateToList$()),
      catchError(() => {
        this.formSnackBar.show("createError");
        return EMPTY;
      }),
      finalize(() => this.isSubmitting.set(false)),
      takeUntilDestroyed(this.destroyRef),
    );
  }

  private navigateToList$() {
    return from(this.router.navigateByUrl(APP_PATH.banners));
  }
}
