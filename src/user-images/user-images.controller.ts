import { Controller } from '@nestjs/common';
import { UserImagesService } from './user-images.service';

@Controller('user-images')
export class UserImagesController {
  constructor(private readonly userImagesService: UserImagesService) {}
}
