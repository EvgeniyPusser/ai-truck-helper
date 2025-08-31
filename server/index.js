import http from "http";
import app from "./app.js";
// server/app.js или server/index.js
import helpersRoutes from "./routes/helpers.routes.js";

app.use("/api/helpers", helpersRoutes); // теперь POST /api/helpers существует


const PORT = process.env.PORT || 3001;
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`[HolyMove] API listening on :${PORT}`);
});
