const jwt = require("jsonwebtoken");
const { errors } = require("../handlers/errors");
const { HttpError } = require("../handlers/apiResponse");

const { JWT_ACCESS_SECRET } = process.env;

const verifyToken = (req, res, next) => {
  const { name, code } = errors[401];
  try {
    const bearerToken = req.headers?.authorization;

    if (!bearerToken) {
      throw new HttpError("User is not authorized", name, [], code);
    }

    const token = bearerToken.split(" ")[1];
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    throw new HttpError("User is not authorized", name, [], code);
  }
};

module.exports = {
  verifyToken,
};
