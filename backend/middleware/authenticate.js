const httpStatus = require("http-status");
const JWT = require("jsonwebtoken");
const config = require("../config");
const { User } = require("../models");

module.exports = () => {
  return async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(httpStatus.UNAUTHORIZED).json({
            message: "Unauthorized",
        });
    }
    
    JWT.verify(token, config.jwt.secret, async (error, user) => {
      if (error) return res.status(httpStatus.UNAUTHORIZED).json({ message: "Unauthorized" });

      req.user = await User.findById(user.id);
      next();
    });
  };
};
