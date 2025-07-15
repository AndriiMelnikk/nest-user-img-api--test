import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/Shema/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userShema: Model<User>) {}

  async getUser() {
    await this.userShema.create({ name: 'Antom', city: 'Lutsk' });

    return 'Користувач сторено';
  }
}
