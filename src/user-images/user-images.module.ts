import { Module } from '@nestjs/common';
import { UserImagesService } from './user-images.service';
import { UserImagesController } from './user-images.controller';

@Module({
  controllers: [UserImagesController],
  providers: [UserImagesService],
})
export class UserImagesModule {}
