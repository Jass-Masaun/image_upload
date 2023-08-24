const router = require("express").Router();

const _controller = require("../controllers/stripe");
const { verifyToken } = require("../middlewares/jwt");

router.get("/get-all-plans", verifyToken, _controller.getAllPlans);
router.post("/subscribe-plan", verifyToken, _controller.subscribePlan);
router.post(
  "/cancel-subscription",
  verifyToken,
  _controller.cancelSubscription
);
router.post(
  "/get-subscription",
  verifyToken,
  _controller.getSubscriptionStatus
);
router.post("/webhook", _controller.webhook);

module.exports = router;
