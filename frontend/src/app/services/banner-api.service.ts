import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import type { Banner } from "../models/banner.model";

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

  list(): Observable<Banner[]> {
    return this.http.get<Banner[]>(this.base);
  }
}
