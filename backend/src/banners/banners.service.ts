import { Injectable, NotFoundException } from "@nestjs/common";
import type { BannerEntity } from "./banner.entity";
import type { CreateBannerDto } from "./dto/create-banner.dto";
import { BannersRepository } from "./banners.repository";
import { sequentialBannerIds } from "./banner-id-generator";

@Injectable()
export class BannersService {
  private idSequence: Generator<number, never, void> | null = null;

  constructor(private readonly bannersRepository: BannersRepository) {}

  /**
   * Newest first (by id). Offset/limit for infinite scroll; limit capped in controller.
   */
  async findPage(
    offset: number,
    limit: number,
  ): Promise<{ items: BannerEntity[]; total: number }> {
    const all = await this.bannersRepository.readAll();
    const sorted = [...all].sort((a, b) => b.id - a.id);
    const total = sorted.length;
    const items = sorted.slice(offset, offset + limit);
    return { items, total };
  }

  async findOne(id: number): Promise<BannerEntity> {
    const list = await this.bannersRepository.readAll();
    const banner = list.find((b) => b.id === id);
    if (!banner) {
      throw new NotFoundException(`Banner ${id} not found`);
    }
    return banner;
  }

  async create(dto: CreateBannerDto): Promise<BannerEntity> {
    const list = await this.bannersRepository.readAll();
    this.ensureIdSequence(list);
    const { value: id } = this.idSequence!.next();
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

  async update(id: number, dto: CreateBannerDto): Promise<BannerEntity> {
    const list = await this.bannersRepository.readAll();
    const idx = list.findIndex((b) => b.id === id);
    if (idx === -1) {
      throw new NotFoundException(`Banner ${id} not found`);
    }
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
    const next = list.filter((b) => b.id !== id);
    if (next.length === list.length) {
      throw new NotFoundException(`Banner ${id} not found`);
    }
    await this.bannersRepository.writeAll(next);
  }

  private ensureIdSequence(list: BannerEntity[]): void {
    if (this.idSequence) {
      return;
    }
    this.idSequence = sequentialBannerIds(this.firstIdFromList(list));
  }

  private firstIdFromList(list: BannerEntity[]): number {
    const nums = list
      .map((b) => (typeof b.id === "number" ? b.id : Number(b.id)))
      .filter((n) => Number.isFinite(n) && n > 0);
    return nums.length === 0 ? 1 : Math.max(...nums) + 1;
  }
}
