import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@schema/user.schema';
import { PaginateQueryDto } from './dto/paginate-query.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { multerImageOptions } from '@common/utils/multer-options';
import { unlink } from 'fs/promises';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(@Query() query: PaginateQueryDto): Promise<User[]> {
    return this.usersService.findAll(query);
  }

  @Get('count')
  async getUsersCount(): Promise<number> {
    return this.usersService.getUsersCount();
  }

  @Post()
  @UseInterceptors(FilesInterceptor('images', 10, multerImageOptions()))
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() dto: CreateUserDto,
    @Req() req: Request,
  ) {
    try {
      await this.usersService.createUserWithImage(dto, files, req);
      return { message: 'Користувача створено успішно' };
    } catch (error) {
      if (files?.length) {
        await Promise.all(
          files.map(async (file) => {
            try {
              await unlink(file.path);
            } catch (unlinkError) {
              console.error(
                'Не вдалося видалити файл після помилки:',
                unlinkError,
              );
            }
          }),
        );
      }
      throw error;
    }
  }
}
