import { computed, inject, Injectable, signal } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { APP_PATH, bannerEditPath } from "../../app-paths";
import type { Banner } from "../../models/banner.model";
import { BannerApiService } from "../../services/banner-api.service";
import { AppDialogService } from "../../shared/app-dialog/app-dialog.service";
import { AppToastService } from "../../shared/app-toast/app-toast.service";
import {
  BANNER_LIST_COPY,
  BANNER_LIST_PAGE_SIZE,
} from "./banner-list.constants";
import type { BannerCardVm } from "./banner-list.types";
import { BannerPreviewService } from "./services/banner-preview.service";

@Injectable()
export class BannerListFacade {
  private readonly appDialog = inject(AppDialogService);
  private readonly toast = inject(AppToastService);
  private readonly bannerApi = inject(BannerApiService);
  private readonly preview = inject(BannerPreviewService);

  readonly banners = signal<Banner[]>([]);
  readonly total = signal(0);
  readonly isLoading = signal(true);
  readonly isLoadingMore = signal(false);
  readonly loadError = signal<string | null>(null);

  readonly createBannerPath = APP_PATH.bannersNew;

  readonly hasMore = computed(
    () => this.banners().length < this.total(),
  );

  readonly bannerCards = computed((): BannerCardVm[] =>
    this.banners().map((b) => ({
      banner: b,
      previewUrl: this.preview.toPreviewUrl(b),
      editPath: bannerEditPath(b.id),
    })),
  );

  constructor() {
    void this.reload();
  }

  async reload(): Promise<void> {
    this.isLoading.set(true);
    this.loadError.set(null);
    try {
      const page = await firstValueFrom(
        this.bannerApi.listPage({ offset: 0, limit: BANNER_LIST_PAGE_SIZE }),
      );
      this.banners.set(page.items);
      this.total.set(page.total);
    } catch {
      this.loadError.set(BANNER_LIST_COPY.loadError);
      this.banners.set([]);
      this.total.set(0);
    } finally {
      this.isLoading.set(false);
    }
  }

  async loadMore(): Promise<void> {
    if (!this.hasMore() || this.isLoadingMore() || this.isLoading()) {
      return;
    }
    this.isLoadingMore.set(true);
    try {
      const page = await firstValueFrom(
        this.bannerApi.listPage({
          offset: this.banners().length,
          limit: BANNER_LIST_PAGE_SIZE,
        }),
      );
      if (page.items.length === 0) {
        this.total.set(this.banners().length);
        return;
      }
      this.banners.update((prev) => [...prev, ...page.items]);
      this.total.set(page.total);
    } catch {
      this.toast.error(BANNER_LIST_COPY.loadError, 5000);
    } finally {
      this.isLoadingMore.set(false);
    }
  }

  async onDeleteClick(banner: Banner): Promise<void> {
    const ref = this.appDialog.openConfirm({
      title: BANNER_LIST_COPY.deleteTitle,
      body: BANNER_LIST_COPY.deleteBody,
    });
    const result = await firstValueFrom(ref.closed);
    if (result !== true) {
      return;
    }
    try {
      await firstValueFrom(this.bannerApi.delete(banner.id));
      this.toast.success(BANNER_LIST_COPY.deletedSnack, 4000);
      await this.reload();
    } catch {
      this.toast.error(BANNER_LIST_COPY.deleteErrorSnack, 6000);
    }
  }
}
