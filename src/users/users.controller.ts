import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@schema/user.schema';
import { PaginateQueryDto } from './dto/paginate-query.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateUserDto } from './dto/create-user.dto';
import { multerImageOptions } from '@common/utils/multer-options';
import { unlink } from 'fs/promises';

@Controller('user')
export class UsersController {
  constructor(
    private readonly usersService: UsersService
  ) {}

  @Get()
  async findAll(@Query() query: PaginateQueryDto): Promise<User[]> {
    return this.usersService.findAll(query);
  }

  @Get('count')
  async getUsersCount(): Promise<number>{
    return this.usersService.getUsersCount();
  }

  @Post()
  @UseInterceptors(FileInterceptor('file', multerImageOptions()))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateUserDto,
  ) {
    try {
      const user = this.usersService.createUserWithImage(dto, file.filename);
      return user;
    } catch (error) {
      if (file && file.path) {
        try {
          await unlink(file.path);
        } catch (unlinkError) {
          console.error('Не вдалося видалити файл після помилки:', unlinkError);
        }
      }
      throw error;
    }
  }
}
