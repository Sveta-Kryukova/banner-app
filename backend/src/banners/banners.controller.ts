import { Body, Controller, Get, Post } from "@nestjs/common";
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { BannerEntity } from "./banner.entity";
import { CreateBannerDto } from "./dto/create-banner.dto";
import { BannersService } from "./banners.service";

@ApiTags("banners")
@Controller("banners")
export class BannersController {
  constructor(private readonly bannersService: BannersService) {}

  @Get()
  @ApiOperation({ summary: "List all banners" })
  @ApiOkResponse({
    description: "All banners",
    type: BannerEntity,
    isArray: true,
  })
  findAll(): Promise<BannerEntity[]> {
    return this.bannersService.findAll();
  }

  @Post()
  @ApiOperation({ summary: "Create a banner" })
  @ApiCreatedResponse({ description: "Created banner", type: BannerEntity })
  create(@Body() dto: CreateBannerDto): Promise<BannerEntity> {
    return this.bannersService.create(dto);
  }
}
