import crypto from "crypto";
const sha = (s) => crypto.createHash("sha256").update(s).digest("hex");
// import users from "../data/clients.json";
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
  // Moving companies
  {
    id: "mc1",
    email: "company1@example.com",
    role: "moving_company",
    passwordHash: sha("company123"),
    name: "FastMove",
  },
  {
    id: "mc2",
    email: "company2@example.com",
    role: "moving_company",
    passwordHash: sha("company456"),
    name: "SafeTransport",
  },
  // Trucks for rent
  {
    id: "t1",
    email: "truck1@example.com",
    role: "truck",
    passwordHash: sha("truck123"),
    model: "Mercedes Sprinter",
  },
  // Drivers
  {
    id: "d1",
    email: "driver1@example.com",
    role: "driver",
    passwordHash: sha("driver123"),
    name: "Ivan Ivanov",
  },
  // Agents
  {
    id: "a1",
    email: "agent1@example.com",
    role: "agent",
    passwordHash: sha("agent123"),
    name: "Agent Smith",
  },
];

export const findUserByEmail = async (email) =>
  users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
export const verifyPassword = async (user, password) =>
  user.passwordHash === sha(password);
