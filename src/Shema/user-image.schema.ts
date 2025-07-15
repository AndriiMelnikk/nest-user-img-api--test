import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from './user.schema';

@Schema()
export class UserImage extends Document {
  @Prop()
  image: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User | string;
}

export const UserImageSchema = SchemaFactory.createForClass(UserImage);
