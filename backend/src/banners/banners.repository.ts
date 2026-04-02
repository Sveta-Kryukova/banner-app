import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { promises as fs } from "fs";
import { join } from "path";
import { parseStoredBanners } from "./banner-parsing";
import type { BannerEntity } from "./banner.entity";

const DATA_DIR = join(process.cwd(), "data");
const DATA_FILE = join(DATA_DIR, "banners.json");

@Injectable()
export class BannersRepository {
  private readonly logger = new Logger(BannersRepository.name);

  async readAll(): Promise<BannerEntity[]> {
    const raw = await this.readFileRaw();
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw) as unknown;
    } catch {
      this.logger.error(`Invalid JSON in ${DATA_FILE}`);
      throw new InternalServerErrorException("Stored data is corrupted");
    }
    return parseStoredBanners(parsed);
  }

  async writeAll(list: BannerEntity[]): Promise<void> {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(list, null, 2), "utf8");
  }

  private async readFileRaw(): Promise<string> {
    try {
      return await fs.readFile(DATA_FILE, "utf8");
    } catch {
      return "[]";
    }
  }
}
