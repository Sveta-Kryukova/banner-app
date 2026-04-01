import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';

export interface BannerEntity {
  id: string;
  name: string;
  imageBase64: string;
  createdAt: string;
}

const DATA_DIR = join(process.cwd(), 'data');
const DATA_FILE = join(DATA_DIR, 'banners.json');

@Injectable()
export class BannersService {
  async findAll(): Promise<BannerEntity[]> {
    const raw = await this.readFileRaw();
    return JSON.parse(raw) as BannerEntity[];
  }

  async create(dto: { name: string; imageBase64: string }): Promise<BannerEntity> {
    const list = await this.findAll();
    const banner: BannerEntity = {
      id: randomUUID(),
      name: dto.name,
      imageBase64: dto.imageBase64,
      createdAt: new Date().toISOString(),
    };
    list.push(banner);
    await this.writeAll(list);
    return banner;
  }

  private async readFileRaw(): Promise<string> {
    try {
      return await fs.readFile(DATA_FILE, 'utf8');
    } catch {
      return '[]';
    }
  }

  private async writeAll(list: BannerEntity[]): Promise<void> {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(list, null, 2), 'utf8');
  }
}
