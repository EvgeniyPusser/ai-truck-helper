import rateLimit from "express-rate-limit";
const base = (opts) =>
  rateLimit({ standardHeaders: true, legacyHeaders: false, ...opts });

export const limits = {
  auth: base({ windowMs: 15 * 60 * 1000, max: 50 }),
  chat: base({ windowMs: 60 * 1000, max: 20 }),
};
