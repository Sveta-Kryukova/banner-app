import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";
import { MAX_IMAGE_BASE64_CHARS } from "../banners.constants";

const trim = ({ value }: { value: unknown }): unknown =>
  typeof value === "string" ? value.trim() : value;

export class CreateBannerDto {
  @ApiProperty({ maxLength: 200, example: "Summer sale" })
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name: string = "";

  @ApiProperty({
    description: "Image as raw base64 (no data: prefix)",
    maxLength: MAX_IMAGE_BASE64_CHARS,
  })
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(MAX_IMAGE_BASE64_CHARS)
  imageBase64: string = "";
}
