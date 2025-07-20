import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '@schema/user.schema';
import { PaginateQueryDto } from './dto/paginate-query.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userShema: Model<UserDocument>) {}

  async findAll(query: PaginateQueryDto) {
    try {
      const users = await this.userShema.find().exec();

      console.log(users);
      return users;
    } catch (error) {
      throw new InternalServerErrorException(
        'Помилка при отримані користувачів',
      );
    }
  }

  async createUserWithImage(dto: CreateUserDto, fileName: string) {
    try {
      console.log(dto, fileName);
    } catch (error) {}
  }
}
