import crypto from "crypto";
const sha = (s) => crypto.createHash("sha256").update(s).digest("hex");

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
];

export const findUserByEmail = async (email) =>
  users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
export const verifyPassword = async (user, password) =>
  user.passwordHash === sha(password);
