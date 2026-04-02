import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

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

  fileToRawBase64$(file: File): Observable<string> {
    return new Observable<string>((subscriber) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        if (typeof result !== "string") {
          subscriber.error(
            new Error("FileReader returned non-string result"),
          );
          return;
        }
        const idx = result.indexOf("base64,");
        subscriber.next(idx >= 0 ? result.slice(idx + 7) : result);
        subscriber.complete();
      };
      reader.onerror = () => {
        const err = reader.error;
        subscriber.error(
          err instanceof Error ? err : new Error("Failed to read file"),
        );
      };
      reader.readAsDataURL(file);
      return () => {
        reader.abort();
      };
    });
  }

  revokePreviewIfBlob(url: string | null): void {
    if (url?.startsWith("blob:")) {
      URL.revokeObjectURL(url);
    }
  }

  createObjectUrl(file: File): string {
    return URL.createObjectURL(file);
  }

  dataUrlFromRawBase64(rawBase64: string): string {
    const mime = this.detectMimeFromRawBase64(rawBase64);
    return `data:${mime};base64,${rawBase64}`;
  }

  private detectMimeFromRawBase64(rawBase64: string): "image/jpeg" | "image/png" {
    const bytes = this.peekBytesFromBase64(rawBase64, 8);
    if (bytes[0] === 0xff && bytes[1] === 0xd8) {
      return "image/jpeg";
    }
    if (
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47
    ) {
      return "image/png";
    }
    return "image/jpeg";
  }

  private peekBytesFromBase64(rawBase64: string, n: number): Uint8Array {
    const needed = Math.ceil((n * 4) / 3);
    const chunk = rawBase64.slice(0, needed + 4);
    const pad = chunk.length % 4;
    const padded = pad ? chunk + "=".repeat(4 - pad) : chunk;
    const bin = atob(padded);
    const out = new Uint8Array(n);
    for (let i = 0; i < n; i++) {
      out[i] = bin.charCodeAt(i);
    }
    return out;
  }
}
