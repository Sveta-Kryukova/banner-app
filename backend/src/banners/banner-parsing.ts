import { InternalServerErrorException } from '@nestjs/common';
import type { BannerEntity } from './banner.entity';

function extractBannerFields(
  o: Record<string, unknown>,
): Pick<BannerEntity, 'name' | 'imageBase64' | 'createdAt'> | null {
  const name = typeof o.name === 'string' ? o.name : '';
  const imageBase64 = typeof o.imageBase64 === 'string' ? o.imageBase64 : '';
  const createdAt =
    typeof o.createdAt === 'string'
      ? o.createdAt
      : new Date(0).toISOString();
  if (!name || !imageBase64) {
    return null;
  }
  return { name, imageBase64, createdAt };
}

function parseNumericId(o: Record<string, unknown>): number | null {
  if (typeof o.id === 'number' && Number.isFinite(o.id) && o.id > 0) {
    return o.id;
  }
  if (typeof o.id === 'string' && /^\d+$/.test(o.id.trim())) {
    return Number(o.id);
  }
  return null;
}

export function parseStoredBanners(json: unknown): BannerEntity[] {
  if (!Array.isArray(json)) {
    throw new InternalServerErrorException('Stored data must be a JSON array');
  }

  type Row = Pick<BannerEntity, 'name' | 'imageBase64' | 'createdAt'> & {
    idNum: number | null;
  };

  const rows: Row[] = [];

  for (const item of json) {
    if (typeof item !== 'object' || item === null) {
      continue;
    }
    const o = item as Record<string, unknown>;
    const fields = extractBannerFields(o);
    if (!fields) {
      continue;
    }
    rows.push({ ...fields, idNum: parseNumericId(o) });
  }

  let maxNumeric = 0;
  for (const r of rows) {
    if (r.idNum !== null) {
      maxNumeric = Math.max(maxNumeric, r.idNum);
    }
  }

  let next = maxNumeric + 1;
  const result: BannerEntity[] = [];
  for (const r of rows) {
    const id = r.idNum !== null ? r.idNum : next++;
    result.push({
      id,
      name: r.name,
      imageBase64: r.imageBase64,
      createdAt: r.createdAt,
    });
  }

  return result;
}
