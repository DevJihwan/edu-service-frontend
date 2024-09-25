import mongoose, { Connection } from 'mongoose';

const MONGODB_URI = "mongodb+srv://jihwan114:!SJH552016@runmongo.idlha08.mongodb.net/?retryWrites=true&w=majority&appName=RunMongo"

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

/**
 * Global is used to maintain a cached connection across hot reloads in development.
 * This prevents connections growing exponentially during API Route usage.
 */
interface Cached {
  conn: Connection | null;
  promise: Promise<Connection> | null;
}

// Declare a global variable to cache the connection across hot reloads
declare global {
  var mongoose: Cached;
}

let cached: Cached = global.mongoose || { conn: null, promise: null };

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  console.log("Start Connect Mongo DB");

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose.connection; // Ensure we return the connection object
    });
  }
  cached.conn = await cached.promise;
  console.log("Finish Connect Mongo DB");

  return cached.conn;
}

export default connectToDatabase;
