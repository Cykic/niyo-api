import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { User, UserDocument } from '../../users/entities/user.entity';

export type TaskDocument = Task & Document;
@Schema({ timestamps: true, versionKey: false })
export class Task {
  @Prop({ trim: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ default: false })
  completed: string;

  @Prop({
    ref: User.name,
    type: SchemaTypes.ObjectId,
  })
  user: UserDocument;
}
const TaskSchema = SchemaFactory.createForClass(Task).set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  },
});

export default TaskSchema;
