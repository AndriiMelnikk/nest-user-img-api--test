// src/common/utils/multer-options.ts
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Request } from 'express';
import { existsSync, mkdirSync } from 'fs';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export function editFileName(
  _req: Request,
  file: Express.Multer.File,
  cb: (error: Error | null, filename: string) => void,
) {
  const uniqueName = Date.now() + '_' + file.originalname.replace(/\s+/g, '');
  cb(null, uniqueName);
}

export function imageFileFilter(
  _req: Request,
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile: boolean) => void,
) {
  if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
    return cb(new Error('Тільки зображення!'), false);
  }
  cb(null, true);
}

export function multerImageOptions(dir = './uploads'): MulterOptions {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  return {
    storage: diskStorage({
      destination: dir,
      filename: editFileName,
    }),
    fileFilter: imageFileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  };
}
