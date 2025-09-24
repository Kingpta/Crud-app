const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Users = require("../models/User");
const bcrypt = require("bcrypt");

const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = 10;

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password || password.length < 3) {
      return res.status(400).json({ error: "username and password (min 3 chars) required" });
    }

    const exists = await Users.findOne({ username });
    if (exists) return res.status(400).json({ error: "User already exists" });

    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = new Users({ username, password: hash });
    await user.save();

    res.status(201).json({ id: user._id, username: user.username });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ error: "username and password required" });

    const user = await Users.findOne({ username });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, {
      expiresIn: "3d",
    });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;
