import { Injectable } from "@nestjs/common";
import type { BannerEntity } from "./banner.entity";
import type { CreateBannerDto } from "./dto/create-banner.dto";
import { BannersRepository } from "./banners.repository";
import { sequentialBannerIds } from "./banner-id-generator";

@Injectable()
export class BannersService {
  private idSequence: Generator<number, never, void> | null = null;

  constructor(private readonly bannersRepository: BannersRepository) {}

  findAll(): Promise<BannerEntity[]> {
    return this.bannersRepository.readAll();
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
