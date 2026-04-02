import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import { AppModule } from './app.module';
import { ApplicationExceptionFilter } from './common/filters/application-exception.filter';
import { HttpLoggingInterceptor } from './common/interceptors/http-logging.interceptor';

const JSON_BODY_LIMIT_BYTES = 15 * 1024 * 1024;

async function bootstrap() {
  const server = express();
  server.use(express.json({ limit: JSON_BODY_LIMIT_BYTES }));

  const adapter = new ExpressAdapter(server);
  const app = await NestFactory.create(AppModule, adapter, {
    bodyParser: false,
  });

  app.setGlobalPrefix('api');
  app.useGlobalFilters(new ApplicationExceptionFilter());
  app.useGlobalInterceptors(new HttpLoggingInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept'],
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Banner API')
    .setDescription('REST API for banner storage')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('swagger', app, document, {
    useGlobalPrefix: true,
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Listening on http://localhost:${port}/api`);
  console.log(`OpenAPI UI: http://localhost:${port}/api/swagger`);
}
void bootstrap();
