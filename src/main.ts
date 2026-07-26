import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { logger } from '@/middlewares/logger.middleware';
import { PayloadValidationPipe } from '@/pipes/validation.pipe';
import { ResponseInterceptor } from '@/common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(logger);
  app.useGlobalPipes(PayloadValidationPipe);
  app.useGlobalInterceptors(new ResponseInterceptor());

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
