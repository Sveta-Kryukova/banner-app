import { Injectable } from '@nestjs/common';

@Injectable()
export class ItemsService {
  findAll(): unknown[] {
    return [];
  }

  findOne(_id: string): null {
    return null;
  }

  create(): { ok: true } {
    return { ok: true };
  }

  update(_id: string): { ok: true } {
    return { ok: true };
  }

  remove(_id: string): { ok: true } {
    return { ok: true };
  }
}
