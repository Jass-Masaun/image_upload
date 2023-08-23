const { HttpError } = require("../handlers/apiResponse");
const { errors } = require("../handlers/errors");

const handleUploadValidations = (fn, req, res, next, uploadSize) => {
  const image = uploadSize === 1 ? "image" : "images";

  fn(req, res, (err) => {
    if (err) {
      if (err.message === "Unexpected field") {
        const { name, code } = errors[400];
        const error = new HttpError(
          `You can upload only ${uploadSize} ${image} at a time`,
          name,
          [],
          code
        );

        return res.status(error.status_code).json(error);
      } else {
        const { name, code } = errors[500];
        const error = new HttpError("Error uplaoding image", name, [], code);

        res.status(error.status_code).json(error);
      }
    } else {
      next();
    }
  });
};

module.exports = {
  handleUploadValidations,
};
