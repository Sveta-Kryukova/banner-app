import { ApiProperty } from "@nestjs/swagger";
import { MAX_IMAGE_BASE64_CHARS } from "./banners.constants";

export class BannerEntity {
  @ApiProperty({
    type: Number,
    example: 1,
    description: "Sequential numeric id (server-assigned).",
    readOnly: true,
  })
  id = 0;

  @ApiProperty({
    type: String,
    maxLength: 200,
    example: "Summer promo",
    description: "Display name shown in the admin UI.",
  })
  name = "";

  @ApiProperty({
    type: String,
    maxLength: MAX_IMAGE_BASE64_CHARS,
    description: "Image as raw base64 (no data: URL prefix).",
    example:
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  })
  imageBase64 = "";

  @ApiProperty({
    type: String,
    format: "date-time",
    example: "2026-04-02T12:00:00.000Z",
    description: "Creation time (ISO 8601).",
    readOnly: true,
  })
  createdAt = "";
}
