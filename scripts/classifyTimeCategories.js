const { MongoClient } = require('mongodb');

// MongoDB connection URI
const uri = "mongodb+srv://jihwan114:!SJH552016@runmongo.idlha08.mongodb.net/?retryWrites=true&w=majority&appName=RunMongo"; // Replace with your MongoDB connection string

// Database and Collection Name
const dbName = 'test';
const collectionName = 'courses';

async function classifyTimeCategories() {
  // Create a new MongoClient
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    // Connect to MongoDB
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Fetch all documents with a valid time field
    const courses = await collection.find({ time: { $exists: true } }).toArray();

    // Process each document and classify time into categories
    for (const course of courses) {
      // Extract the start hour from the time (e.g., "13:30~14:30")
      const timeMatch = course.time?.match(/\d{1,2}:\d{2}/);
      if (!timeMatch) continue; // Skip if time is invalid

      const startHour = parseInt(timeMatch[0].split(':')[0], 10); // Get the hour part of the time

      // Classify the start hour into time categories
      let timeCategory = 'Other';
      if (startHour >= 6 && startHour < 9) {
        timeCategory = 'Early Morning';
      } else if (startHour >= 9 && startHour < 12) {
        timeCategory = 'Morning';
      } else if (startHour >= 12 && startHour < 15) {
        timeCategory = 'Afternoon';
      } else if (startHour >= 15 && startHour < 18) {
        timeCategory = 'Late Afternoon';
      } else if (startHour >= 18 && startHour < 21) {
        timeCategory = 'Evening';
      }

      // Update the document with the new timeCategory field
      await collection.updateOne(
        { _id: course._id }, // Match by document ID
        { $set: { timeCategory: timeCategory } } // Set the timeCategory field
      );
    }

    console.log('Time categories have been updated for all documents.');
  } catch (error) {
    console.error('Error classifying time categories:', error);
  } finally {
    // Close the MongoDB connection
    await client.close();
  }
}

classifyTimeCategories();
