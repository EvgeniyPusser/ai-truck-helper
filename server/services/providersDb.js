import { getDb } from "../db/mongo.js";

const PROVIDERS_COLLECTION = "providers";

export async function listProviders(filters = {}) {
  const query = {};

  if (filters.serviceType) {
    query.serviceType = filters.serviceType;
  }

  if (filters.activeOnly !== false) {
    query.status = "active";
  }

  const db = getDb();
  return db
    .collection(PROVIDERS_COLLECTION)
    .find(query)
    .sort({ rating: -1, name: 1 })
    .toArray();
}

export async function seedProviders() {
  const db = getDb();
  const providers = [
    {
      slug: "elite-movers",
      name: "Elite Movers",
      serviceType: "moving_company",
      rating: 4.9,
      serviceZips: ["90001", "10001", "11201"],
      pricing: {
        baseHourlyRate: 55,
        helperHourlyRate: 35,
        mileageRate: 1.45,
        truckDailyRate: 90,
        minimumHours: 3,
      },
      services: ["packing", "unpacking", "storage"],
      status: "active",
      updatedAt: new Date(),
    },
    {
      slug: "topmovers-pro",
      name: "TopMovers Pro",
      serviceType: "moving_company",
      rating: 4.8,
      serviceZips: ["90001", "10001", "60601"],
      pricing: {
        baseHourlyRate: 60,
        helperHourlyRate: 38,
        mileageRate: 1.3,
        truckDailyRate: 80,
        minimumHours: 3,
      },
      services: ["packing", "furniture_assembly", "fragile_items"],
      status: "active",
      updatedAt: new Date(),
    },
    {
      slug: "quickmove-express",
      name: "QuickMove Express",
      serviceType: "moving_company",
      rating: 4.6,
      serviceZips: ["90001", "11201", "33101"],
      pricing: {
        baseHourlyRate: 50,
        helperHourlyRate: 32,
        mileageRate: 1.55,
        truckDailyRate: 95,
        minimumHours: 2,
      },
      services: ["same_day", "furniture_assembly"],
      status: "active",
      updatedAt: new Date(),
    },
  ];

  const result = await Promise.all(
    providers.map((provider) =>
      db.collection(PROVIDERS_COLLECTION).updateOne(
        { slug: provider.slug },
        {
          $set: provider,
          $setOnInsert: { createdAt: new Date() },
        },
        { upsert: true }
      )
    )
  );

  return {
    matched: result.reduce((sum, item) => sum + item.matchedCount, 0),
    modified: result.reduce((sum, item) => sum + item.modifiedCount, 0),
    upserted: result.reduce((sum, item) => sum + item.upsertedCount, 0),
  };
}
