import mongoose, { Schema, Document, model } from 'mongoose';

interface ICourse extends Document {
  title: string;
  location: string;
  date: string;
  info: string;
  target: string;
  time: string;
  sessionType: string;
}

const CourseSchema: Schema = new Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: String, required: false },
  info: { type: String, required: true },
  target: { type: String, required: true },
  time: { type: String, required: true },
  sessionType: { type: String, required: true }
});

export default mongoose.models.Course || model<ICourse>('Course', CourseSchema);
