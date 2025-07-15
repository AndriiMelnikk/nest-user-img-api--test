import { Command, Console } from 'nestjs-console';
import { UserSeeder } from './user.seeder';
import { UserImageSeeder } from './user-img.seeder';
import { User, UserDocument } from '@schema/user.schema';
import { Injectable } from '@nestjs/common';

@Console()
@Injectable()
export class SeedCommand {
  constructor(
    private readonly userSeeder: UserSeeder,
    private readonly userImageSeeder: UserImageSeeder,
  ) {}

  @Command({
    command: 'seed',
    description: 'Seed database with fake data',
  })
  async seed() {
    console.log('Початок заповнення бази даними...');

    console.log('Додавання користувачів...');
    const createdUsers: UserDocument[] = await this.userSeeder.seed();

    console.log('Додаваня зображеь для користувачів...');
    await this.userImageSeeder.seed(createdUsers);

    console.log('База даних готова!');
  }
}
