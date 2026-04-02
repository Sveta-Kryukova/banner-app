import type { Banner } from "../banner.model";

export interface BannerListPageResponse {
  readonly items: Banner[];
  readonly total: number;
}

export interface CreateBannerPayload {
  readonly name: string;
  readonly imageBase64: string;
}

export type UpdateBannerPayload = CreateBannerPayload;
