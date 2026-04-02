import { Injectable } from "@nestjs/common";
import { expectFound, expectFoundIndex } from "../common/assert/expect-found";
import { BannerIdSequence } from "./banner-id-generator";
import type { BannerEntity } from "./banner.entity";
import { BannersRepository } from "./banners.repository";
import type { CreateBannerDto } from "./dto/create-banner.dto";
import type { UpdateBannerDto } from "./dto/update-banner.dto";

@Injectable()
export class BannersService {
  private idSequence: BannerIdSequence | null = null;

  constructor(private readonly bannersRepository: BannersRepository) {}

  async findPage(
    offset: number,
    limit: number,
  ): Promise<{ items: BannerEntity[]; total: number }> {
    const all = await this.bannersRepository.readAll();
    const sorted = [...all].sort((a, b) => a.id - b.id);
    const total = sorted.length;
    const items = sorted.slice(offset, offset + limit);
    return { items, total };
  }

  async findOne(id: number): Promise<BannerEntity> {
    const list = await this.bannersRepository.readAll();
    return expectFound(list.find((b) => b.id === id));
  }

  async create(dto: CreateBannerDto): Promise<BannerEntity> {
    const list = await this.bannersRepository.readAll();
    this.ensureIdSequence(list);
    const id = this.idSequence!.nextId();
    const banner: BannerEntity = {
      id,
      name: dto.name,
      imageBase64: dto.imageBase64,
      createdAt: new Date().toISOString(),
    };
    list.push(banner);
    await this.bannersRepository.writeAll(list);
    return banner;
  }

  async update(id: number, dto: UpdateBannerDto): Promise<BannerEntity> {
    const list = await this.bannersRepository.readAll();
    const idx = expectFoundIndex(list.findIndex((b) => b.id === id));
    const updated: BannerEntity = {
      ...list[idx],
      name: dto.name,
      imageBase64: dto.imageBase64,
    };
    list[idx] = updated;
    await this.bannersRepository.writeAll(list);
    return updated;
  }

  async remove(id: number): Promise<void> {
    const list = await this.bannersRepository.readAll();
    expectFound(list.find((b) => b.id === id));
    await this.bannersRepository.writeAll(list.filter((b) => b.id !== id));
  }

  private ensureIdSequence(list: BannerEntity[]): void {
    if (this.idSequence) {
      return;
    }
    this.idSequence = new BannerIdSequence(this.nextIdAfterMax(list));
  }

  private nextIdAfterMax(list: BannerEntity[]): number {
    if (list.length === 0) {
      return 1;
    }
    const maxId = list.reduce((m, b) => Math.max(m, b.id), 0);
    return maxId + 1;
  }
}
