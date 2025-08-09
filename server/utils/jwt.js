import jwt from "jsonwebtoken";
const SECRET = process.env.JWT_SECRET || "dev-secret-change";
export const signToken = (payload, opts = {}) =>
  jwt.sign(payload, SECRET, { expiresIn: "2h", ...opts });
export const verifyToken = (token) => jwt.verify(token, SECRET);
