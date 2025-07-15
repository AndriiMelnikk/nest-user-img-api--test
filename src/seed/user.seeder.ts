import { faker } from '@faker-js/faker/locale/uk';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '@schema/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserSeeder {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async seed() {
    await this.userModel.deleteMany({});

    const users: any = [];
    for (let i = 0; i < 10; i++) {
      users.push({
        name: `${faker.person.firstName()} ${faker.person.lastName()}`,
        city: faker.location.city(),
      });
    }

    try {
      await this.userModel.insertMany(users);
      console.log('Seeded 10,000 users successfully');
    } catch (error) {
      console.error('Error seeding users:', error);
    }
  }
}
