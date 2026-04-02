import { Module } from "@nestjs/common";
import { BannersModule } from "./banners/banners.module";
import { HealthModule } from "./health/health.module";

@Module({
  imports: [HealthModule, BannersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
