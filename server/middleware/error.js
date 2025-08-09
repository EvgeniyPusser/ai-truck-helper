export function notFound(_req, res) {
  res.status(404).json({ error: "Not found" });
}
export function errorHandler(err, _req, res, _next) {
  console.error("[Error]", err);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
}
