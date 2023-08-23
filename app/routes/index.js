const router = require("express").Router();

router.use("/auth", require("./auth"));
router.use("/image", require("./image"));
router.use("/stripe", require("./stripe"));

module.exports = router;
