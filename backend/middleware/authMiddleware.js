const jwt = require("jsonwebtoken")

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization

  // Patikriname, ar yra prisijungimo žetonas
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Reikalingas prisijungimas",
    })
  }

  // Ištraukiame žetoną
  const token = authHeader.split(" ")[1]

  try {
    // Patikriname žetono galiojimą
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Išsaugome vartotojo duomenis užklausai
    req.user = decoded

    // Leidžiame tęsti
    next()
  } catch (error) {
    return res.status(401).json({
      message: "Netinkamas arba pasibaigęs prisijungimo žetonas",
    })
  }
}

module.exports = authMiddleware