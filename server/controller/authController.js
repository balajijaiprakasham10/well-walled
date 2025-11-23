import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const ADMIN_USER = process.env.ADMIN_USERNAME;
const ADMIN_PASS_HASH = process.env.ADMIN_PASSWORD_HASH;

// Login controller
export const adminLogin = async (req, res) => {
  const { username, password } = req.body;

  if (username !== ADMIN_USER) {
    return res.status(401).json({ msg: "Invalid username" });
  }

  const isMatch = await bcrypt.compare(password, ADMIN_PASS_HASH);

  if (!isMatch) {
    return res.status(401).json({ msg: "Invalid password" });
  }

  const token = jwt.sign({ username }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.json({ msg: "Login successful", token });
};
