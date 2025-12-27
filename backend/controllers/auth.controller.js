const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "your_secret_key_here";

exports.signup = async (req, res) => {
  const { name, email, password, phone } = req.body;
  const [e] = await pool.query("SELECT userID FROM users WHERE email=?", [
    email,
  ]);
  if (e.length) return res.status(400).json({ error: "Email exists" });

  const hash = await bcrypt.hash(password, 10);
  await pool.query(
    "INSERT INTO users (name,email,password,phone) VALUES (?,?,?,?)",
    [name, email, hash, phone]
  );
  res.json({ message: "Signup success" });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const [u] = await pool.query("SELECT * FROM users WHERE email=?", [email]);
  if (!u.length) return res.status(400).json({ error: "Invalid" });

  const ok = await bcrypt.compare(password, u[0].password);
  if (!ok) return res.status(400).json({ error: "Invalid" });

  const token = jwt.sign({ userID: u[0].userID, role: u[0].role }, JWT_SECRET, {
    expiresIn: "7d",
  });

  res.json({ token, user: u[0] });
};
