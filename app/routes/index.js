const router = require("express").Router();

router.use("/auth", require("./auth"));
router.use("/image", require("./image"));
router.use("/stripe", require("./stripe"));
router.use("/user", require("./user"));

module.exports = router;
