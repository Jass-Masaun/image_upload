const { User, BillingDetail } = require("../models");

const getUserDetailsById = async (userId) => {
  const user = await User.findById(userId);
  const billingDetails = await BillingDetail.findOne({
    user: user._id,
  });

  return {
    id: user._id,
    fullName: user.full_name,
    email: user.email,
    tier: user.tier,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    address: billingDetails || {},
  };
};

module.exports = {
  getUserDetailsById,
};
