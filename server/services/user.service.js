// server/services/user.service.js
import crypto from "crypto";
const sha = (s) => crypto.createHash("sha256").update(s).digest("hex");

// Моки пользователей под все 5 ролей
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
    role: "truck",
    passwordHash: sha("truck123"),
  }, // владелец/водитель
  {
    id: "u4",
    email: "mover@example.com",
    role: "mover",
    passwordHash: sha("mover123"),
  }, // мувинговая компания
  {
    id: "u5",
    email: "agent@example.com",
    role: "agent",
    passwordHash: sha("agent123"),
  }, // агент
];

export const findUserByEmail = async (email) =>
  users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;

export const verifyPassword = async (user, password) =>
  user.passwordHash === sha(password);
