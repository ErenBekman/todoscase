const JWT = require("jsonwebtoken");
const CryptoJS = require("crypto-js");
const crypto = require("crypto");
const config = require("../config");

const passwordToHash = (password) => {
  return CryptoJS.AES.encrypt(password, config.PASSWORD_HASH).toString();
};

const passwordToDec = (password) => {
  return CryptoJS.AES.decrypt(password, config.PASSWORD_HASH);
};

const generateAccessToken = (user) => {
  return JWT.sign({ id: user._id }, config.jwt.secret, {
    expiresIn: "1w",
  });
};

const generateRefreshToken = (user) => {
  return JWT.sign({ id: user._id }, config.REFRESH_HASH);
};

module.exports = {
  passwordToHash,
  passwordToDec,
  generateAccessToken,
  generateRefreshToken
};
