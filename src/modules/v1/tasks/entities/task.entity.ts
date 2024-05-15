import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

export type TaskDocument = Task & Document;
@Schema({ timestamps: true, versionKey: false })
export class Task {
  @Prop({ unique: true, lowercase: true })
  email: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  phone: string;

  @Prop()
  countryCode: string;
}
const TaskSchema = SchemaFactory.createForClass(Task).set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  },
});

export default TaskSchema;
