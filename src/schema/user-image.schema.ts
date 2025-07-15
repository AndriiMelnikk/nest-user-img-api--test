import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ collection: 'user-images', timestamps: true })
export class UserImage extends Document {
  @Prop({ required: true })
  image: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;
}

export type UserImageDocument = UserImage & Document;
export const UserImageSchema = SchemaFactory.createForClass(UserImage);
