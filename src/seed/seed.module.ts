// seed.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSeeder } from './user.seeder';
import { User, UserSchema } from '@schema/user.schema';
import { UserImage, UserImageSchema } from '@schema/user-image.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserImage.name, schema: UserImageSchema },
    ]),
  ],
  providers: [UserSeeder],
  exports: [UserSeeder],
})
export class SeedModule {}
