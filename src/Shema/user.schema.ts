import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  city: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'UserImage' }] })
  images: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
