const { User } = require("../models");

const getUserDetailsById = async (userId) => {
  const user = await User.findById(userId);

  return {
    id: user._id,
    fullName: user.full_name,
    email: user.email,
    tier: user.tier,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

module.exports = {
  getUserDetailsById,
};
