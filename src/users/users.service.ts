import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '@schema/user.schema';
import { PaginateQueryDto } from './dto/paginate-query.dto';
import { CreateUserDto } from './dto/create-user.dto';
import userList from './aggregate/users-list';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userShema: Model<UserDocument>) {}

  async findAll({ page, limit }: PaginateQueryDto) {
    try {
      const skip = (page - 1) * limit;
      const data = await userList(this.userShema, { skip, limit });

      return data;
    } catch (error) {
      throw new InternalServerErrorException(
        'Помилка при отримані користувачів',
      );
    }
  }

  async getUsersCount(): Promise<number> {
    return this.userShema.countDocuments();
  }

  async createUserWithImage(dto: CreateUserDto, fileName: string) {
    try {
      console.log(dto, fileName);
    } catch (error) {}
  }
}
