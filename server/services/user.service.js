// server/services/user.service.js
import crypto from "crypto";
const sha = (s) => crypto.createHash("sha256").update(s).digest("hex");

// Моки пользователей под все 5 ролей + админ
const users = [
  {
    id: "u1",
    email: "client@example.com",
    role: "client",
    passwordHash: sha("client123"),
  },
  {
    id: "u2",
    email: "helper@example.com",
    role: "helper",
    passwordHash: sha("helper123"),
  },
  {
    id: "u3",
    email: "truck@example.com",
    role: "truck_owner",
    passwordHash: sha("truck123"),
  },
  {
    id: "u4",
    email: "mover@example.com",
    role: "moving_company",
    passwordHash: sha("mover123"),
  },
  {
    id: "u5",
    email: "agent@example.com",
    role: "agent",
    passwordHash: sha("agent123"),
  },
  {
    id: "u6",
    email: "admin@example.com",
    role: "admin",
    passwordHash: sha("admin123"),
  },
];

export const findUserByEmail = async (email) =>
  users.find((u) => u.email.toLowerCase() == String(email).toLowerCase()) ||
  null;

export const verifyPassword = async (user, password) =>
  user.passwordHash === sha(password);
