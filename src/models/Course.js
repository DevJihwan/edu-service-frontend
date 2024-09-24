import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const CourseSchema = new Schema({
    title: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: String, required: false },
    info: { type: String, required: true },
    target: { type: String, required: true },
    time: { type: String, required: true },
    sessionType: { type: String, required: true }
});

const Course = mongoose.models.Course || model('Course', CourseSchema);

export default Course;
