import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { BannersService } from './banners.service';

@Controller('banners')
export class BannersController {
  constructor(private readonly bannersService: BannersService) {}

  @Get()
  findAll() {
    return this.bannersService.findAll();
  }

  @Post()
  create(@Body() body: { name?: string; imageBase64?: string }) {
    const name = typeof body?.name === 'string' ? body.name.trim() : '';
    if (!name) {
      throw new BadRequestException('name is required');
    }
    const imageBase64 =
      typeof body?.imageBase64 === 'string' ? body.imageBase64.trim() : '';
    if (!imageBase64) {
      throw new BadRequestException('imageBase64 is required');
    }
    return this.bannersService.create({ name, imageBase64 });
  }
}
