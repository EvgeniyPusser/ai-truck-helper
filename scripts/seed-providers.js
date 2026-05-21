import "dotenv/config";
import { closeMongo, connectMongo } from "../server/db/mongo.js";
import { seedProviders } from "../server/services/providersDb.js";

try {
  await connectMongo();
  const result = await seedProviders();
  console.log("[HolyMove] Providers seeded:", result);
} finally {
  await closeMongo();
}
