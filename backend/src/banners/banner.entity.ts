import { ApiProperty } from '@nestjs/swagger';

export class BannerEntity {
  @ApiProperty({ example: 1, description: 'Sequential numeric id' })
  id!: number;

  @ApiProperty({ example: 'Summer promo' })
  name!: string;

  @ApiProperty({ description: 'Raw base64 (no data: URL prefix)' })
  imageBase64!: string;

  @ApiProperty({ example: '2026-04-02T12:00:00.000Z' })
  createdAt!: string;
}
