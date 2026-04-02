import { computed, DestroyRef, inject, Injectable, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { defer, EMPTY } from "rxjs";
import {
  catchError,
  filter,
  finalize,
  map,
  switchMap,
  tap,
} from "rxjs/operators";
import { APP_PATH, bannerEditPath } from "../../app-paths";
import type { Banner } from "../../models/banner.model";
import { BannerApiService } from "../../services/banner-api.service";
import { BannerImageFileService } from "../../services/banner-image-file.service";
import { AppDialogService } from "../../shared/app-dialog/app-dialog.service";
import { AppToastService } from "../../shared/app-toast/app-toast.service";
import {
  BANNER_LIST_COPY,
  BANNER_LIST_PAGE_SIZE,
} from "./banner-list.constants";
import type { BannerCardVm } from "./banner-list.types";

@Injectable()
export class BannerListFacade {
  readonly ui = BANNER_LIST_COPY;

  private readonly destroyRef = inject(DestroyRef);
  private readonly appDialog = inject(AppDialogService);
  private readonly toast = inject(AppToastService);
  private readonly bannerApi = inject(BannerApiService);
  private readonly imageFile = inject(BannerImageFileService);

  readonly banners = signal<Banner[]>([]);
  readonly total = signal(0);
  readonly isLoading = signal(true);
  readonly isLoadingMore = signal(false);
  readonly loadError = signal<string | null>(null);

  readonly createBannerPath = APP_PATH.bannersNew;

  readonly hasMore = computed(() => this.banners().length < this.total());

  readonly bannerCards = computed((): BannerCardVm[] =>
    this.banners().map((b) => ({
      banner: b,
      previewUrl: this.imageFile.dataUrlFromRawBase64(b.imageBase64),
      editPath: bannerEditPath(b.id),
    })),
  );

  constructor() {
    this.reload();
  }

  reload(): void {
    this.reloadFull$()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  loadMore(): void {
    if (!this.hasMore() || this.isLoadingMore() || this.isLoading()) {
      return;
    }
    this.isLoadingMore.set(true);
    this.bannerApi
      .listPage({
        offset: this.banners().length,
        limit: BANNER_LIST_PAGE_SIZE,
      })
      .pipe(
        tap({
          next: (page) => {
            if (page.items.length === 0) {
              this.total.set(this.banners().length);
              return;
            }
            this.banners.update((prev) => [...prev, ...page.items]);
            this.total.set(page.total);
          },
        }),
        catchError(() => {
          this.toast.error(BANNER_LIST_COPY.loadError, 5000);
          return EMPTY;
        }),
        finalize(() => this.isLoadingMore.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  onDeleteClick(banner: Banner): void {
    const ref = this.appDialog.openConfirm({
      title: BANNER_LIST_COPY.deleteTitle,
      body: BANNER_LIST_COPY.deleteBody,
    });
    ref.closed
      .pipe(
        filter((r): r is true => r === true),
        switchMap(() => this.bannerApi.delete(banner.id)),
        tap(() =>
          this.toast.success(BANNER_LIST_COPY.deletedSnack, 4000),
        ),
        switchMap(() => this.reloadFull$()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        error: () =>
          this.toast.error(BANNER_LIST_COPY.deleteErrorSnack, 6000),
      });
  }

  private reloadFull$() {
    return defer(() => {
      this.isLoading.set(true);
      this.loadError.set(null);
      return this.loadFirstPage$();
    }).pipe(
      map(() => undefined),
      finalize(() => this.isLoading.set(false)),
    );
  }

  private loadFirstPage$() {
    return this.bannerApi
      .listPage({ offset: 0, limit: BANNER_LIST_PAGE_SIZE })
      .pipe(
        tap({
          next: (page) => {
            this.banners.set(page.items);
            this.total.set(page.total);
          },
        }),
        catchError(() => {
          this.loadError.set(BANNER_LIST_COPY.loadError);
          this.banners.set([]);
          this.total.set(0);
          return EMPTY;
        }),
      );
  }
}
