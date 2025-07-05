import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI as string
if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable in .env.local")
}

// Augment the NodeJS global type
declare global {
  // Only declare once
  // eslint-disable-next-line no-var
  var mongoose: {
    conn: mongoose.Connection | null
    promise: Promise<mongoose.Connection> | null
  } | undefined
}

const cached = global.mongoose || { conn: null, promise: null }

export async function connectToDatabase(): Promise<mongoose.Connection> {
  //If already connected (readyState 1 = connected), return existing connection
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection
  }

  //Use cached connection if it exists
  if (cached.conn) return cached.conn

  // If no cached promise, create a new one
  if (!cached.promise) {
    cached.promise = mongoose
    .connect(MONGODB_URI, {
        bufferCommands: false,
        connectTimeoutMS: 30000,  // 30 seconds timeout
        socketTimeoutMS: 30000,   // 30 seconds timeout
      })
      .then((mongoose) => mongoose.connection)
  }

  cached.conn = await cached.promise
  global.mongoose = cached // Cache globally
  console.log("MongoDB connected");
  return cached.conn
}
