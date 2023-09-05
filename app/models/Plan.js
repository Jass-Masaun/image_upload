const mongoose = require("mongoose");

const planSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "User id is required"],
    },
    plan_id: {
      type: String,
      required: [true, "Plan id is required"],
    },
    subscription_id: {
      type: String,
      required: [true, "Subscription id is required"],
    },
    payment_id: {
      type: String,
    },
    payment_status: {
      type: String,
    },
    client_secret: {
      type: String,
    },
    name: {
      type: String,
      required: [true, "Plan name is required"],
    },
    amount: {
      type: Number,
      required: [true, "Plan amount is required"],
    },
    current: {
      type: Boolean,
    },
    is_cancelled: {
      type: Boolean,
    },
    expire_on: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const Plan = mongoose.model("Plan", planSchema);

module.exports = {
  Plan,
};
