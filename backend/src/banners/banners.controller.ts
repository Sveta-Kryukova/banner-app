import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
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
  @ApiOperation({
    summary: "List banners (paginated, newest first)",
  })
  @ApiOkResponse({
    description: "Paginated list: { items: BannerEntity[], total: number }",
  })
  findPage(
    @Query("offset", new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Query("limit", new DefaultValuePipe(12), ParseIntPipe) limit: number,
  ): Promise<{ items: BannerEntity[]; total: number }> {
    const safeOffset = Math.max(0, offset);
    const safeLimit = Math.min(Math.max(1, limit), 50);
    return this.bannersService.findPage(safeOffset, safeLimit);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get one banner by id" })
  @ApiOkResponse({ description: "Banner", type: BannerEntity })
  findOne(@Param("id", ParseIntPipe) id: number): Promise<BannerEntity> {
    return this.bannersService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: "Create a banner" })
  @ApiCreatedResponse({ description: "Created banner", type: BannerEntity })
  create(@Body() dto: CreateBannerDto): Promise<BannerEntity> {
    return this.bannersService.create(dto);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a banner" })
  @ApiOkResponse({ description: "Updated banner", type: BannerEntity })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: CreateBannerDto,
  ): Promise<BannerEntity> {
    return this.bannersService.update(id, dto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete a banner" })
  @ApiNoContentResponse({ description: "Removed" })
  async remove(@Param("id", ParseIntPipe) id: number): Promise<void> {
    await this.bannersService.remove(id);
  }
}
