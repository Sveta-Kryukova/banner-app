import { PickType } from "@nestjs/swagger";
import { CreateBannerDto } from "./create-banner.dto";

export class UpdateBannerDto extends PickType(CreateBannerDto, [
  "name",
  "imageBase64",
] as const) {}
