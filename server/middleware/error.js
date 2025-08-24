// export function notFound(_req, res) {
//   res.status(404).json({ error: "Not found" });
// }
// export function errorHandler(err, _req, res, _next) {
//   console.error("[Error]", err);
//   res.status(err.status || 500).json({ error: err.message || "Server error" });
// }

// server/middleware/error.js
function notFound(req, res, next) {
  res.status(404).json({ error: "NotFound", path: req.path });
}

function errorHandler(err, req, res, next) {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.name || "InternalError",
    message: err.message || "Unknown",
  });
}

module.exports = { notFound, errorHandler };
