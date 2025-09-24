const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

function authenticateToken(req, res, next) {
  const authHeader = req.header("Authorization") || "";
  const parts = authHeader.split(" ");

  if (parts.length !== 2)
    return res
      .status(401)
      .json({ error: "Missing or malformed authorization header" });

  const scheme = parts[0];
  const token = parts[1];

  if (!/^Bearer$/i.test(scheme))
    return res.status(401).json({ error: "Malformed token scheme" });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Token invalid or expired" });
    req.user = decoded; // decoded will contain what we sign (e.g., { id, username })
    next();
  });
}

module.exports = authenticateToken;
