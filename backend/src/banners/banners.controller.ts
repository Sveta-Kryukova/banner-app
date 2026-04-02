import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
} from "@nestjs/common";
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { ParamId, ROUTE_PARAM_ID } from "../common/http/route-params";
import { BannerEntity } from "./banner.entity";
import {
  QueryBannerLimit,
  QueryBannerOffset,
} from "./banners-query.decorators";
import { BANNER_LIST_MAX_LIMIT } from "./banners.constants";
import { BannersService } from "./banners.service";
import { CreateBannerDto } from "./dto/create-banner.dto";
import { UpdateBannerDto } from "./dto/update-banner.dto";

@ApiTags("banners")
@Controller("banners")
export class BannersController {
  constructor(private readonly bannersService: BannersService) {}

  @Get()
  @ApiOperation({
    summary: "List banners (paginated, oldest first by id)",
  })
  @ApiOkResponse({
    description: "Paginated list: { items: BannerEntity[], total: number }",
  })
  findPage(
    @QueryBannerOffset() offset: number,
    @QueryBannerLimit() limit: number,
  ): Promise<{ items: BannerEntity[]; total: number }> {
    const safeOffset = Math.max(0, offset);
    const safeLimit = Math.min(Math.max(1, limit), BANNER_LIST_MAX_LIMIT);
    return this.bannersService.findPage(safeOffset, safeLimit);
  }

  @Get(`:${ROUTE_PARAM_ID}`)
  @ApiOperation({ summary: "Get one banner by id" })
  @ApiOkResponse({ description: "Banner", type: BannerEntity })
  findOne(@ParamId() id: number): Promise<BannerEntity> {
    return this.bannersService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: "Create a banner" })
  @ApiCreatedResponse({ description: "Created banner", type: BannerEntity })
  create(@Body() dto: CreateBannerDto): Promise<BannerEntity> {
    return this.bannersService.create(dto);
  }

  @Patch(`:${ROUTE_PARAM_ID}`)
  @ApiOperation({ summary: "Update a banner" })
  @ApiOkResponse({ description: "Updated banner", type: BannerEntity })
  update(
    @ParamId() id: number,
    @Body() dto: UpdateBannerDto,
  ): Promise<BannerEntity> {
    return this.bannersService.update(id, dto);
  }

  @Delete(`:${ROUTE_PARAM_ID}`)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete a banner" })
  @ApiNoContentResponse({ description: "Removed" })
  async remove(@ParamId() id: number): Promise<void> {
    await this.bannersService.remove(id);
  }
}
