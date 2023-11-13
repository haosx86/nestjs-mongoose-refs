import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Comment' })
  comments: Comment[];
}

export const UserSchema = SchemaFactory.createForClass(User);
