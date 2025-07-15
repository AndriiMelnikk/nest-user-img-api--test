import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { FileCleanupExceptionFilter } from '@common/utils/file-cleanup-exception.filter';
import { ConsoleAppModule } from './seed/console.module';
import { SeedCommand } from './seed/seed.coomand';

async function bootstrap() {
  if (process.argv.includes('seed')) {
    const app = await NestFactory.createApplicationContext(ConsoleAppModule);

    const seedCommand = app.get(SeedCommand);

    await seedCommand.seed();

    await app.close();
    return;
  }

  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new FileCleanupExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
