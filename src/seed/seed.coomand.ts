// seed.command.ts
import { Command, Console } from 'nestjs-console';
import { UserSeeder } from './user.seeder';
// import { UserImageSeeder } from './user-image.seeder';

@Console()
export class SeedCommand {
  constructor(
    private readonly userSeeder: UserSeeder, // private readonly userImageSeeder: UserImageSeeder,
  ) {}

  @Command({
    command: 'seed',
    description: 'Seed database with fake data',
  })
  async seed() {
    console.log('Starting database seeding...');

    console.log('Seeding users...');
    await this.userSeeder.seed();

    console.log('Seeding user images...');
    // await this.userImageSeeder.seed();

    console.log('Database seeding completed successfully!');
  }
}
