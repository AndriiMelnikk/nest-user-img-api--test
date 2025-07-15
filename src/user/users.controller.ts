import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { User, UserSchema } from 'src/Shema/user.schema';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  get_user() {
    console.log('w')
    return this.usersService.getUser();
  }
}
