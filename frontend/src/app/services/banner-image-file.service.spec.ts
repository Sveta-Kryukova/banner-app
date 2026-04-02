import { firstValueFrom } from "rxjs";
import { describe, expect, it } from "vitest";
import { BannerImageFileService } from "./banner-image-file.service";

describe("BannerImageFileService", () => {
  const service = new BannerImageFileService();

  describe("validateForBanner", () => {
    it("rejects non-JPEG/PNG types", () => {
      const file = new File([""], "x.gif", { type: "image/gif" });
      const result = service.validateForBanner(file);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.message.length).toBeGreaterThan(0);
      }
    });

    it("accepts PNG", () => {
      const file = new File([""], "x.png", { type: "image/png" });
      expect(service.validateForBanner(file)).toEqual({ ok: true });
    });
  });

  describe("fileToRawBase64$", () => {
    it("emits raw base64 without data URL prefix", async () => {
      const bytes = new Uint8Array([0xff, 0xd8, 0xff]);
      const file = new File([bytes], "tiny.jpg", { type: "image/jpeg" });
      const raw = await firstValueFrom(service.fileToRawBase64$(file));
      expect(raw).not.toContain("base64");
      expect(raw.length).toBeGreaterThan(0);
    });
  });

  describe("dataUrlFromRawBase64", () => {
    it("builds a data URL for JPEG magic bytes", () => {
      const jpegPrefix = btoa(String.fromCharCode(0xff, 0xd8, 0xff));
      const url = service.dataUrlFromRawBase64(jpegPrefix);
      expect(url.startsWith("data:image/jpeg;base64,")).toBe(true);
    });
  });
});
