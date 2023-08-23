const jwt = require("jsonwebtoken");

const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } = process.env;

const generateToken = (user) => {
  const accessToken = jwt.sign(
    {
      id: user._id,
      name: user.full_name,
      email: user.email,
    },
    JWT_ACCESS_SECRET,
    { expiresIn: "1d" }
  );

  const refreshToken = jwt.sign(
    {
      id: user._id,
      name: user.full_name,
      email: user.email,
    },
    JWT_REFRESH_SECRET,
    { expiresIn: "30d" }
  );

  return {
    accessToken,
    refreshToken,
  };
};

module.exports = {
  generateToken,
};
