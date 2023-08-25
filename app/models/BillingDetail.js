const mongoose = require("mongoose");

const billingSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "User id is required"],
    },
    line1: {
      type: String,
    },
    line2: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    country: {
      type: String,
    },
    postal_code: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const BillingDetail = mongoose.model("BillingDetail", billingSchema);

module.exports = {
  BillingDetail,
};
