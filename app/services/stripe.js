const { stripe } = require("../config/stripe");
const { HttpError } = require("../handlers/apiResponse");
const { errors } = require("../handlers/errors");
const { User } = require("../models");

const createCustomer = async (requestBody) => {
  const user = await User.findById(requestBody.userId);

  if (user?.stripe_customer_id) {
    return {
      customerId: user.stripe_customer_id,
      alreadyExists: true,
    };
  }

  const customer = await stripe.customers.create({
    source: requestBody.stripeToken,
    email: requestBody.email,
  });

  return {
    customerId: customer.id,
    alreadyExists: false,
  };
};

const getPlanById = async (planId) => {
  const plan = await stripe.plans.retrieve(planId);

  if (!plan) {
    const { name, code } = errors[404];
    throw new HttpError("Invalid plan", name, [], code);
  }

  const product = await stripe.products.retrieve(plan.product);

  plan.product = product;

  return plan;
};

module.exports = {
  createCustomer,
  getPlanById,
};
