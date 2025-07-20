import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  city: string;

  @Prop({ default: 0 })
  imageCount: number;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
