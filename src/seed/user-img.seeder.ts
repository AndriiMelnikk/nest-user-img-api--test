import { faker } from '@faker-js/faker/locale/uk';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserImage, UserImageDocument } from '@schema/user-image.schema';
import { User, UserDocument } from '@schema/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserImageSeeder {
  private readonly imgLength = 500;
  private readonly imagesToInsert = 100000;
  private readonly batchSize = 2000;

  constructor(
    @InjectModel(UserImage.name)
    private readonly userImageModel: Model<UserImageDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async seed(createdUsers: UserDocument[]) {
    await this.userImageModel.deleteMany({});
    await this.userModel.updateMany({}, { $set: { imageCount: 0 } });

    const imageUrls: string[] = [];
    for (let i = 0; i < this.imgLength; i++) {
      imageUrls.push(
        faker.image.urlLoremFlickr({
          width: 640,
          height: 480,
          category: 'people',
        }),
      );
    }

    const imageDocs: any[] = [];

    for (let i = 0; i < this.imagesToInsert; i++) {
      const randomUser =
        createdUsers[Math.floor(Math.random() * createdUsers.length)];
      const randomUrl = imageUrls[Math.floor(Math.random() * imageUrls.length)];

      imageDocs.push({
        image: randomUrl,
        // @ts-ignore
        user: randomUser._id,
      });

      if (
        imageDocs.length === this.batchSize ||
        i === this.imagesToInsert - 1
      ) {
        const insertedDocs = await this.userImageModel.insertMany(imageDocs);

        const countPerUser = imageDocs.reduce(
          (acc, doc) => {
            const userId = doc.user.toString();
            acc[userId] = (acc[userId] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>,
        );

        await Promise.all(
          Object.entries(countPerUser).map(([userId, count]) =>
            this.userModel.updateOne(
              { _id: userId },
              { $inc: { imageCount: count } },
            ),
          ),
        );

        console.log(`Додано зображень: ${i + 1} / ${this.imagesToInsert}`);
        imageDocs.length = 0;
      }
    }
  }
}
