import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.startAllMicroservices();
  app.useGlobalGuards();
  app.use(cookieParser());
  await app.listen(3000);
}

bootstrap();
