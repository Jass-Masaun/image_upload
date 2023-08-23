const router = require("express").Router();

const _controller = require("../controllers/image");
const { uploadImage } = require("../middlewares/image");

const { verifyToken } = require("../middlewares/jwt");

router.post("/store", verifyToken, uploadImage, _controller.storeImage);
router.get("/download", _controller.downloadImage);
router.get("/view", _controller.viewImage);
router.get("/all", _controller.getAllImages);

module.exports = router;
