import { faker } from '@faker-js/faker/locale/uk';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserImage, UserImageDocument } from '@schema/user-image.schema';
import { UserDocument } from '@schema/user.schema';

import {
  AnyObject,
  ClientSession,
  Document,
  DocumentSetOptions,
  Error,
  MergeType,
  Model,
  ModifiedPathsSnapshot,
  pathsToSkip,
  PopulateOptions,
  Query,
  QueryOptions,
  SaveOptions,
  ToObjectOptions,
  Types,
  UpdateQuery,
  UpdateWithAggregationPipeline,
} from 'mongoose';

@Injectable()
export class UserImageSeeder {
  constructor(
    @InjectModel(UserImage.name)
    private readonly userImageModel: Model<UserImageDocument>,
  ) {}

  async seed(createdUsers: UserDocument[]) {
    await this.userImageModel.deleteMany({});

    const imageUrls: string[] = [];

    for (let i = 0; i < 50; i++) {
      imageUrls.push(
        faker.image.urlLoremFlickr({
          width: 640,
          height: 480,
          category: 'people',
        }),
      );
    }

    const imagesToInsert = 10;
    const batchSize = 5;

    const imageDocs: any[] = [];

    for (let i = 0; i < imagesToInsert; i++) {
      const randomUser =
        createdUsers[Math.floor(Math.random() * createdUsers.length)];
      const randomUrl = imageUrls[Math.floor(Math.random() * imageUrls.length)];

      imageDocs.push({
        image: randomUrl,
        // @ts-ignore
        user: randomUser._id,
      });

      if (imageDocs.length === batchSize || i === imagesToInsert - 1) {
        await this.userImageModel.insertMany(imageDocs);
        console.log(`Додано зображень: ${i + 1} / ${imagesToInsert}`);
        imageDocs.length = 0;
      }
    }
  }
}
