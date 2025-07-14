import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { UserImagesModule } from './user-images/user-images.module';

@Module({
  imports: [UsersModule, UserImagesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
