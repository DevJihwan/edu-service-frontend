const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Course = require('../src/models/Course');

// MongoDB 연결 설정
const MONGODB_URI = process.env.MONGODB_URI;
console.log('MONGODB_URI : '+MONGODB_URI);

mongoose.connect(MONGODB_URI);

mongoose.connection.on('connected', async () => {
  console.log('Connected to MongoDB');

  try {
    // JSON 파일 읽기
    const dataPath = path.join(__dirname, '../data/courses.json');
    console.log(`Reading data from ${dataPath}...`);
    
    const jsonData = fs.readFileSync(dataPath, 'utf-8');
    const courses = JSON.parse(jsonData);

    console.log(`Inserting ${courses.length} courses into the database...`);

    // 데이터베이스에 데이터 삽입
    await Course.insertMany(courses);
    console.log('Data successfully inserted!');

  } catch (error) {
    console.error('Error inserting data:', error);
  } finally {
    // 연결 종료
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }
});

mongoose.connection.on('error', (err: Error) => {
  console.error('MongoDB connection error:', err);
});
