const router = require("express").Router();

const _controller = require("../controllers/auth");

router.post("/create-user", _controller.createUser);
router.post("/login-user", _controller.loginUser);

module.exports = router;
