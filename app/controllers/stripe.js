const { stripe } = require("../config/stripe");
const { createCustomer, getPlanById } = require("../services/stripe");

const { Plan, User } = require("../models");

const { HttpSuccess, HttpError } = require("../handlers/apiResponse");

const { formatUSD } = require("../utils/currency");
const { errors } = require("../handlers/errors");

const getAllPlans = async (req, res, next) => {
  try {
    const products = await Promise.all([
      stripe.products.list({}),
      stripe.plans.list({}),
    ]).then((stripeData) => {
      let products = stripeData[0].data;
      let plans = stripeData[1].data;

      plans = plans
        .sort((a, b) => a.amount - b.amount)
        .map((plan) => {
          const amount = formatUSD(plan.amount);
          return { ...plan, amount };
        });

      products.forEach((product) => {
        const filteredPlans = plans.filter((plan) => {
          return plan.product === product.id;
        });

        product.plans = filteredPlans;
      });

      return products;
    });

    const response = new HttpSuccess("Stripe plans", products);
    res.status(response.status_code).json(response);
  } catch (error) {
    next(error);
  }
};

const subscribePlan = async (req, res, next) => {
  try {
    const { id, email } = req.user;
    const { planId, stripeToken } = req.body;

    const planDetails = await getPlanById(planId);
    const planName = planDetails.product.name;
    const planAmount = parseInt(planDetails.amount_decimal);

    const { customerId, alreadyExists } = await createCustomer({
      userId: id,
      email,
      stripeToken,
    });

    if (!alreadyExists) {
      await User.findByIdAndUpdate(id, {
        stripe_customer_id: customerId,
      });
    }

    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [
        {
          plan: planId,
        },
      ],
    });

    await Plan.updateMany({ user: id }, { $set: { current: false } });

    const plan = new Plan({
      user: id,
      plan_id: planId,
      name: planName,
      amount: planAmount,
      subscription_id: subscription.id,
      current: true,
    });

    await plan.save();

    if (planAmount === 500) {
      await User.findByIdAndUpdate(id, { tier: "Monthly" });
    }

    if (planAmount === 0) {
      await User.findByIdAndUpdate(id, { tier: "Free" });
    }

    const response = new HttpSuccess(
      "Plan subscribed successfully",
      subscription
    );
    res.status(response.status_code).json(response);
  } catch (error) {
    next(error);
  }
};

const cancelSubscription = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { subscription_id, plan_id } = req.body;

    const plan = await Plan.findOne({
      user: id,
      plan_id,
      subscription_id,
    });

    plan.current = false;
    plan.is_cancelled = true;
    await plan.save();

    if (!plan) {
      const { name, code } = errors[400];
      throw new HttpError("User not subscribed to this plan", name, [], code);
    }

    await User.findByIdAndUpdate(id, { tier: "Free" });

    await stripe.subscriptions.cancel(subscription_id);

    const response = new HttpSuccess("User unsubscribed to plan", null);
    res.status(response.status_code).json(response);
  } catch (error) {
    next(error);
  }
};

const getSubscriptionStatus = async (req, res, next) => {
  try {
    const { subscription_id } = req.body;

    const subscription = await stripe.subscriptions.retrieve(subscription_id);

    const response = new HttpSuccess("Subscription status", subscription);
    res.status(response.status_code).json(response);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPlans,
  subscribePlan,
  cancelSubscription,
  getSubscriptionStatus,
};
