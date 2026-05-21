import "dotenv/config";
import http from "http";
import app from "./app.js";
import { connectMongo, isMongoConfigured } from "./db/mongo.js";
const PORT = process.env.PORT || 3001;
const server = http.createServer(app);
async function start() {
    if (isMongoConfigured()) {
        try {
            await connectMongo();
        }
        catch (error) {
            console.error("[HolyMove] MongoDB unavailable; starting API without persistence:", error);
        }
    }
    server.listen(PORT, () => {
        console.log(`[HolyMove] API listening on :${PORT}`);
    });
}
start().catch((error) => {
    console.error("[HolyMove] Failed to start API:", error);
    process.exit(1);
});
