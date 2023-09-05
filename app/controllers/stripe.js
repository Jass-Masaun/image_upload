const { stripe } = require("../config/stripe");
const { createCustomer, getPlanById } = require("../services/stripe");

const { Plan, User } = require("../models");

const { HttpSuccess, HttpError } = require("../handlers/apiResponse");

const { formatUSD } = require("../utils/currency");
const { errors } = require("../handlers/errors");

const { WEBHOOK_SECRET } = process.env;

const getAllPlans = async (req, res, next) => {
  try {
    const { id } = req.user;

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

    const plan = await Plan.findOne({
      user: id,
      current: true,
    });

    let plans = [];

    if (plan?.plan_id) {
      plans = products.map((product) => {
        const { name, plans } = product;
        return {
          id: plans[0].id,
          name: name,
          amount: plans[0].amount,
          currency: plans[0].currency,
          interval: plans[0].interval,
          selected: plan.plan_id === plans[0].id ? true : false,
          benefits:
            plans[0].amount_decimal === "0"
              ? [
                  "You can upload only single image at a time",
                  "You can upload only one image/hour",
                ]
              : [
                  "You can upload multiple images at a time",
                  "There is no one image/hour restriction",
                ],
        };
      });
    } else {
      plans = products.map((product) => {
        const { name, plans } = product;
        return {
          id: plans[0].id,
          name: name,
          amount: plans[0].amount,
          currency: plans[0].currency,
          interval: plans[0].interval,
          selected: plans[0].amount_decimal === "0" ? true : false,
          benefits:
            plans[0].amount_decimal === "0"
              ? [
                  "You can upload only single image at a time",
                  "You can upload only one image/hour",
                ]
              : [
                  "You can upload multiple images at a time",
                  "There is no one image/hour restriction",
                ],
        };
      });
    }

    const response = new HttpSuccess("Stripe plans", { plans });
    res.status(response.status_code).json(response);
  } catch (error) {
    next(error);
  }
};

const subscribePlan = async (req, res, next) => {
  try {
    const { id, email, name } = req.user;
    const { planId, stripeToken, address } = req.body;

    const planDetails = await getPlanById(planId);
    const planName = planDetails.product.name;
    const planAmount = parseInt(planDetails.amount_decimal);

    const { customerId, alreadyExists } = await createCustomer({
      userId: id,
      email,
      name,
      address,
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
      expand: ["latest_invoice.payment_intent"],
    });

    await Plan.updateMany({ user: id }, { $set: { current: false } });

    const plan = new Plan({
      user: id,
      plan_id: planId,
      name: planName,
      amount: planAmount,
      subscription_id: subscription.id,
      payment_status: "pending",
      current: true,
      client_secret: subscription.latest_invoice.payment_intent.client_secret,
    });

    await plan.save();

    const response = new HttpSuccess("Plan subscribed successfully", {
      client_secret: subscription.latest_invoice.payment_intent.client_secret,
    });
    res.status(response.status_code).json(response);
  } catch (error) {
    next(error);
  }
};

const cancelSubscription = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { plan_id } = req.body;

    const plan = await Plan.findOne({
      user: id,
      plan_id,
      current: true,
    });

    if (!plan) {
      const { name, code } = errors[400];
      throw new HttpError("User not subscribed to this plan", name, [], code);
    }

    const subscriptionObject = await stripe.subscriptions.cancel(
      plan.subscription_id
    );

    const subscriptionExpireDate = subscriptionObject.current_period_end;

    plan.expire_on = subscriptionExpireDate;
    await plan.save();

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

const webhook = async (req, res, next) => {
  const payload = req.body;
  const signature = req.headers["stripe-signature"];

  try {
    // const event = stripe.webhooks.constructEvent(
    //   payload,
    //   signature,
    //   WEBHOOK_SECRET
    // );

    // console.log(JSON.stringify(event));

    // Handle different event types
    switch (payload.type) {
      case "payment_intent.succeeded":
        const paymentIntent = payload.data.object;
        const clientSecret = payload.data.object.client_secret;

        const plan = await Plan.findOne({
          client_secret: clientSecret,
          current: true,
        });

        plan.payment_id = paymentIntent.id;
        plan.payment_status = "success";

        await plan.save();

        if (plan.amount === 500) {
          await User.findByIdAndUpdate(plan.user, { tier: "monthly" });
        }

        if (plan.amount === 0) {
          await User.findByIdAndUpdate(plan.user, { tier: "free" });
        }
        break;
      case "payment_intent.payment_failed":
        const paymentIntentt = payload.data.object;
        const clientSecrett = payload.data.object.client_secret;

        const plann = await Plan.findOne({
          client_secret: clientSecrett,
          current: true,
        });

        plann.payment_id = paymentIntentt.id;
        plann.payment_status = "failed";
        plann.current = false;

        await plann.save();

        await stripe.subscriptions.cancel(plann.subscription_id);
        break;
      default:
        // Unexpected payload type
        console.log("Unexpected payload type:", payload.type);
    }

    res.status(200).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPlans,
  subscribePlan,
  cancelSubscription,
  getSubscriptionStatus,
  webhook,
};
