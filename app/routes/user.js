const router = require("express").Router();

const _controller = require("../controllers/user");
const { verifyToken } = require("../middlewares/jwt");

router.get("/details", verifyToken, _controller.getUserDetails);

module.exports = router;
