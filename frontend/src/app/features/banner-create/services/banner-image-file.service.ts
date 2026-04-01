import { Injectable } from "@angular/core";

const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPT_TYPES = new Set(["image/jpeg", "image/png"]);

export type BannerImageValidationResult =
  | { readonly ok: true }
  | { readonly ok: false; readonly message: string };

@Injectable({ providedIn: "root" })
export class BannerImageFileService {
  validateForBanner(file: File): BannerImageValidationResult {
    if (!ACCEPT_TYPES.has(file.type)) {
      return { ok: false, message: "Use JPG or PNG only." };
    }
    if (file.size > MAX_BYTES) {
      return { ok: false, message: "Maximum file size is 5 MB." };
    }
    return { ok: true };
  }

  fileToRawBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const idx = result.indexOf("base64,");
        resolve(idx >= 0 ? result.slice(idx + 7) : result);
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  revokeObjectUrl(url: string | null): void {
    if (url) {
      URL.revokeObjectURL(url);
    }
  }

  createObjectUrl(file: File): string {
    return URL.createObjectURL(file);
  }
}
