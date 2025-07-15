import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from './user.schema';

@Schema()
export class UserImage extends Document {
  @Prop({ required: true })
  images: string;

  @Prop({ type: 'ObjectId', ref: 'User', required: true })
  user: User | string;
}

export const UserImageSchema = SchemaFactory.createForClass(UserImage);
