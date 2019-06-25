const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const userToken = req.headers["x-auth-token"];
    jwt.verify(userToken, process.env.SECRET_TOKEN_JWT);
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Veuillez vous reconnecter"
    });
  }
};
