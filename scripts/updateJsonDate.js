import mongoose from 'mongoose';
import fs from 'fs';
//import Course from './model/course.js';
import Course from '../src/models/Course.js';

// MongoDB 연결 설정
//const mongoURI = 'YOUR_MONGO_URI';
const mongoURI = "mongodb+srv://jihwan114:!SJH552016@runmongo.idlha08.mongodb.net/?retryWrites=true&w=majority&appName=RunMongo"
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// JSON 파일 읽기
fs.readFile('../data/scripts/lottemart_courses.json', 'utf8', async (err, data) => {
  if (err) {
    console.error('Error reading JSON file:', err);
    return;
  }

  try {
    const courses = JSON.parse(data);
    for (const course of courses) {
      // courseId를 기준으로 업데이트
      await Course.updateOne(
        { courseId: course.courseId },
        { $set: { timeCategory: course.timeCategory } },
        { upsert: false } // 기존 데이터만 업데이트, 없으면 새로 삽입하지 않음
      );
    }
    console.log('Update completed successfully.');
  } catch (err) {
    console.error('Error parsing JSON data or updating database:', err);
  } finally {
    // 연결 종료
    mongoose.connection.close();
  }
});