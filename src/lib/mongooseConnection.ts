import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;
if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable in .env.local");
}

// Use a global variable so that the value is preserved across module reloads in development.
let cached: { conn: mongoose.Connection | null; promise: Promise<mongoose.Connection> | null } = 
  (global as any).mongoose || { conn: null, promise: null };

export async function connectToDatabase(): Promise<mongoose.Connection> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    }).then((mongoose) => mongoose.connection);
    (global as any).mongoose = cached;
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
