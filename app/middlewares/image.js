const { upload } = require("./multer");
const { handleUploadValidations } = require("../helpers/multer");

const { getUserDetailsById } = require("../services/user");

const uploadImage = async (req, res, next) => {
  const { tier } = await getUserDetailsById(req.user.id);
  req.user.tier = tier;

  const isFreeUser = tier === "free" ? true : false;
  let uploadSize = 20;

  if (isFreeUser) {
    uploadSize = 1;
    const singleUplaod = upload.array("images", uploadSize);
    handleUploadValidations(singleUplaod, req, res, next, uploadSize);
  } else {
    const multipleUplaod = upload.array("images", uploadSize);
    handleUploadValidations(multipleUplaod, req, res, next, uploadSize);
  }
};

module.exports = {
  uploadImage,
};
