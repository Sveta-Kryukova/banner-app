import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import type { Banner } from "../models/banner.model";

export interface BannerListPageResponse {
  items: Banner[];
  total: number;
}

export interface CreateBannerPayload {
  name: string;
  imageBase64: string;
}

@Injectable({ providedIn: "root" })
export class BannerApiService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/banners`;

  create(payload: CreateBannerPayload): Observable<Banner> {
    return this.http.post<Banner>(this.base, payload);
  }

  listPage(params: { offset: number; limit: number }): Observable<BannerListPageResponse> {
    return this.http.get<BannerListPageResponse>(this.base, {
      params: {
        offset: String(params.offset),
        limit: String(params.limit),
      },
    });
  }

  getById(id: number): Observable<Banner> {
    return this.http.get<Banner>(`${this.base}/${id}`);
  }

  update(id: number, payload: CreateBannerPayload): Observable<Banner> {
    return this.http.patch<Banner>(`${this.base}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
