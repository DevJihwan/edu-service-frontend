import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from '../src/models/Course.js';

dotenv.config();

const MONGODB_URI = "mongodb+srv://jihwan114:!SJH552016@runmongo.idlha08.mongodb.net/?retryWrites=true&w=majority&appName=RunMongo"

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function deleteYangcheonData() {
  try {
    const result = await Course.deleteMany({ location: "yangcheon" });
    console.log(`Deleted ${result.deletedCount} courses with location 'yangcheon'`);
  } catch (error) {
    console.error('Error deleting courses:', error);
  }
}

deleteYangcheonData().then(() => {
  mongoose.connection.close();
});
