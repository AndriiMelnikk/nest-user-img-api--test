import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '@schema/user.schema';
import { PaginateQueryDto } from './dto/paginate-query.dto';
import { CreateUserDto } from './dto/create-user.dto';
import userList from './aggregate/users-list';
import { UserWithImageCount } from './type';
import { UserImage, UserImageDocument } from '@schema/user-image.schema';
import { readdir, rename, unlink } from 'fs/promises';
import { extname, join } from 'path';
import { Request } from 'express';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userShema: Model<UserDocument>,
    @InjectModel(UserImage.name)
    private readonly userImageModel: Model<UserImageDocument>,
  ) {}

  async findAll({
    page,
    limit,
  }: PaginateQueryDto): Promise<UserWithImageCount[]> {
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

  async createUserWithImage(
    dto: CreateUserDto,
    files: Express.Multer.File[],
    req: Request,
  ) {
    const protocol = req.protocol;
    const host = req.get('host');
    const baseUrl = `${protocol}://${host}`;

    try {
      const filesInFolder = await readdir('./uploads');
      let currentCount = filesInFolder.length;

      const user = await this.userShema.create({
        name: dto.name,
        city: dto.city,
        imageCount: files.length,
      });

      const imageDocs: UserImageDocument[] = [];

      for (const file of files) {
        currentCount++;

        const ext = extname(file.originalname);
        const newFilename = `img-${currentCount}${ext}`;
        const newPath = join('./uploads', newFilename);
        const imageUrl = `${baseUrl}/upload/${newFilename}`;

        try {
          await rename(file.path, newPath);
        } catch (err) {
          console.error('Помилка при перейменуванні файлу:', err);
          await unlink(file.path);
          throw new Error('Не вдалося зберегти файл зображення');
        }

        const imageDoc = await this.userImageModel.create({
          image: imageUrl,
          user: user._id,
        });

        imageDocs.push(imageDoc);
      }

      return;
    } catch (error) {
      throw new InternalServerErrorException(
        'Помилка при створенні користувача з зображеннями',
        error,
      );
    }
  }
}
