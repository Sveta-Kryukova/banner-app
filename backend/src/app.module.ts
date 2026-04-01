import { Module } from '@nestjs/common';
import { BannersModule } from './banners/banners.module';

@Module({
  imports: [BannersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
