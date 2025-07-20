import { faker } from '@faker-js/faker/locale/uk';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '@schema/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserSeeder {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async seed(): Promise<UserDocument[]> {
    await this.userModel.deleteMany({});

    const users: User[] = [];

    for (let i = 0; i < 20; i++) {
      users.push({
        name: `${faker.person.firstName()} ${faker.person.lastName()}`,
        city: faker.location.city(),
          imageCount: 0,
      });
    }

    try {
      const createdUsers = await this.userModel.insertMany(users);
      console.log('Seeded 10,000 users successfully');
      return createdUsers;
    } catch (error) {
      console.error('Error seeding users:', error);
      return [];
    }
  }
}
