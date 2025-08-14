import { signToken } from "../utils/jwt.js";
import { findUserByEmail, verifyPassword } from "../services/user.service.js";

export async function login(req, res) {
  const { email, password } = req.body || {};
  if (!email || !password)
    return res.status(400).json({ error: "email and password are required" });
  const user = await findUserByEmail(email);
  if (!user || !(await verifyPassword(user, password)))
    return res.status(401).json({ error: "Invalid credentials" });
  const token = signToken({ id: user.id, role: user.role });
  res.json({
    token,
    user: { id: user.id, email: user.email, role: user.role },
  });
}
