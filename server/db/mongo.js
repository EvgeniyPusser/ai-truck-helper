import { MongoClient, ServerApiVersion } from "mongodb";
import process from "node:process";

const uri = process.env.MONGODB_URI || process.env.DB_URL || "";
const dbName = process.env.MONGODB_DB_NAME || "holy_move";
const mongoDisabled = ["1", "true", "yes"].includes(
  String(process.env.MONGODB_DISABLED || "").toLowerCase()
);

let client;
let db;
let connectPromise;

export function isMongoConfigured() {
  return Boolean(!mongoDisabled && uri && uri !== "your_database_url_here");
}

export async function connectMongo() {
  if (mongoDisabled) {
    console.warn("[HolyMove] MongoDB is disabled via MONGODB_DISABLED.");
    return null;
  }

  if (!isMongoConfigured()) {
    console.warn("[HolyMove] MongoDB is not configured; set MONGODB_URI to enable it.");
    return null;
  }

  if (db) return db;
  if (connectPromise) return connectPromise;

  client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  connectPromise = client
    .connect()
    .then(async () => {
      db = client.db(dbName);
      await db.command({ ping: 1 });
      console.log(`[HolyMove] Connected to MongoDB database "${dbName}"`);
      return db;
    })
    .catch((error) => {
      connectPromise = null;
      throw error;
    });

  return connectPromise;
}

export function getDb() {
  if (!db) {
    throw new Error("MongoDB is not connected");
  }

  return db;
}

export async function getMongoHealth() {
  if (mongoDisabled) {
    return { configured: false, connected: false, disabled: true };
  }

  if (!isMongoConfigured()) {
    return { configured: false, connected: false };
  }

  try {
    const database = await connectMongo();
    await database.command({ ping: 1 });
    return { configured: true, connected: true, database: dbName };
  } catch (error) {
    return {
      configured: true,
      connected: false,
      error: String(error?.message || error),
    };
  }
}

export async function closeMongo() {
  if (client) {
    await client.close();
  }

  client = null;
  db = null;
  connectPromise = null;
}
