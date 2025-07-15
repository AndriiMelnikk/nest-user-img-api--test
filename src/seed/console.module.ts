import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSeeder } from './user.seeder';
import { User, UserSchema } from '@schema/user.schema';
import { UserImage, UserImageSchema } from '@schema/user-image.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URL', { infer: true }),
      }),
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserImage.name, schema: UserImageSchema },
    ]),
  ],
  controllers: [],
  providers: [UserSeeder],
})
export class ConsoleAppModule {}
